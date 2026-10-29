import { test } from "node:test";
import assert from "node:assert/strict";
import { APICallError, simulateReadableStream, wrapLanguageModel } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { mensagemParaOVisitante } from "../../src/agents/erro-cliente.ts";
import { criarLimitadorIp, obterIp } from "../../src/agents/limite-ip.ts";
import { MENSAGEM_ERRO_MODELO, MENSAGEM_MUITAS_REQUISICOES, MENSAGEM_SOBRECARGA } from "../../src/agents/mensagens.ts";
import { MODELO_PADRAO, interpretarModelo } from "../../src/agents/modelo.ts";
import { repetirUmaVezEm } from "../../src/agents/repetir-erro.ts";

/** Peças de proteção de custo e abuso. Sem rede, sem custo. */

// ---- limite por IP ---------------------------------------------------------------------

test("o limitador libera até o máximo e bloqueia o excedente, com retry-after", () => {
  let agora = 1_000_000;
  const l = criarLimitadorIp({ maximo: 3, janelaSegundos: 60, agora: () => agora });
  assert.equal(l.verificar("1.1.1.1").permitido, true);
  assert.equal(l.verificar("1.1.1.1").permitido, true);
  assert.equal(l.verificar("1.1.1.1").permitido, true);
  const bloqueado = l.verificar("1.1.1.1");
  assert.equal(bloqueado.permitido, false);
  assert.ok(bloqueado.retryAfterSegundos >= 1 && bloqueado.retryAfterSegundos <= 60);
  agora += 61_000; // a janela reinicia
  assert.equal(l.verificar("1.1.1.1").permitido, true);
});

test("cada IP tem a sua cota", () => {
  const l = criarLimitadorIp({ maximo: 1, janelaSegundos: 60 });
  assert.equal(l.verificar("1.1.1.1").permitido, true);
  assert.equal(l.verificar("1.1.1.1").permitido, false);
  assert.equal(l.verificar("2.2.2.2").permitido, true);
});

test("a memória do limitador não cresce sem limite", () => {
  let agora = 0;
  const l = criarLimitadorIp({ maximo: 5, janelaSegundos: 60, maxChaves: 100, agora: () => agora });
  for (let i = 0; i < 1000; i++) l.verificar(`10.0.${Math.floor(i / 250)}.${i % 250}`);
  assert.ok(l.tamanho() <= 101, `tamanho ${l.tamanho()}`);
  agora += 120_000;
  l.verificar("9.9.9.9"); // dispara a limpeza dos vencidos? só quando cheio: não deve explodir
  assert.ok(l.tamanho() <= 101);
});

test("obterIp prefere os cabeçalhos da plataforma e nunca devolve vazio", () => {
  const req = (h: Record<string, string>) => new Request("http://x/api/chat", { headers: h });
  assert.equal(obterIp(req({ "x-real-ip": "3.3.3.3", "x-forwarded-for": "9.9.9.9" })), "3.3.3.3");
  assert.equal(obterIp(req({ "x-forwarded-for": "4.4.4.4, 5.5.5.5" })), "4.4.4.4");
  assert.equal(obterIp(req({})), "desconhecido");
  assert.equal(obterIp(req({ "x-real-ip": "a".repeat(200) })), "desconhecido");
});

// ---- escolha do modelo (Google direto x AI Gateway) ----------------------------------------

test("sem barra usa o Google direto; provedor/modelo usa o AI Gateway", () => {
  assert.deepEqual(interpretarModelo("gemini-3.5-flash"), { origem: "google", id: "gemini-3.5-flash" });
  assert.deepEqual(interpretarModelo("google/gemini-3.5-flash"), { origem: "gateway", id: "google/gemini-3.5-flash" });
  assert.deepEqual(interpretarModelo("anthropic/claude-sonnet-5.5"), { origem: "gateway", id: "anthropic/claude-sonnet-5.5" });
});

test("valor ausente ou malformado cai no padrão, nunca vira URL ou caminho", () => {
  for (const ruim of [undefined, "", "  ", "https://evil.com/x", "../../etc", "a b", "UPPER", "x/", "/x", "a/b/c", "gemini;rm -rf"]) {
    assert.deepEqual(interpretarModelo(ruim), { origem: "google", id: MODELO_PADRAO }, String(ruim));
  }
});

// ---- repetição do 403 intermitente ------------------------------------------------------------

const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 1, text: 1, reasoning: undefined },
};
const falha = (statusCode: number) =>
  new APICallError({ message: "falha simulada", url: "x", requestBodyValues: {}, statusCode, isRetryable: false });
const streamOk = () => ({
  stream: simulateReadableStream({
    chunks: [
      { type: "stream-start" as const, warnings: [] },
      { type: "text-start" as const, id: "t" },
      { type: "text-delta" as const, id: "t", delta: "ok" },
      { type: "text-end" as const, id: "t" },
      { type: "finish" as const, finishReason: { unified: "stop" as const, raw: undefined }, usage },
    ],
  }),
});

async function chamar(falhasAntes: number, codigo: number) {
  let chamadas = 0;
  const base = new MockLanguageModelV4({
    doStream: async () => {
      chamadas++;
      if (chamadas <= falhasAntes) throw falha(codigo);
      return streamOk();
    },
  });
  const model = wrapLanguageModel({ model: base, middleware: repetirUmaVezEm([403]) });
  const resultado = await model.doStream({ prompt: [{ role: "user", content: [{ type: "text", text: "oi" }] }] }).then(
    () => "ok",
    () => "erro",
  );
  return { chamadas, resultado };
}

test("403 é repetido uma vez e funciona", async () => {
  assert.deepEqual(await chamar(1, 403), { chamadas: 2, resultado: "ok" });
});

test("duas falhas 403 seguidas desistem (só uma repetição)", async () => {
  assert.deepEqual(await chamar(2, 403), { chamadas: 2, resultado: "erro" });
});

test("outros erros não são repetidos por este middleware", async () => {
  assert.deepEqual(await chamar(1, 400), { chamadas: 1, resultado: "erro" });
});

// ---- mensagem de erro no navegador ---------------------------------------------------------

test("só frases conhecidas do servidor chegam à tela; o resto vira a mensagem genérica", () => {
  assert.equal(mensagemParaOVisitante(new Error(MENSAGEM_SOBRECARGA)), MENSAGEM_SOBRECARGA);
  assert.equal(mensagemParaOVisitante(new Error(MENSAGEM_MUITAS_REQUISICOES)), MENSAGEM_MUITAS_REQUISICOES);
  assert.equal(
    mensagemParaOVisitante(new Error(JSON.stringify({ codigo: "muitas-requisicoes", mensagem: "qualquer coisa" }))),
    MENSAGEM_MUITAS_REQUISICOES,
  );
  for (const bruto of [
    new Error("TypeError: Failed to fetch"),
    new Error("<html>502 Bad Gateway</html>"),
    new Error(JSON.stringify({ codigo: "outro", mensagem: "<script>alert(1)</script>" })),
    new Error("detalhe interno com key=ABC"),
    "texto solto",
    null,
  ]) {
    assert.equal(mensagemParaOVisitante(bruto), MENSAGEM_ERRO_MODELO);
  }
});
