import { test } from "node:test";
import assert from "node:assert/strict";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { consultarStatus, tratarChat } from "../../src/agents/chat-handler.ts";
import { NOME_COOKIE, codificarSessao } from "../../src/agents/limite-sessao.ts";

/** Sem rede e sem custo: o modelo é de mentira. Testa a rota, não a qualidade do agente. */

const SEGREDO = "s".repeat(48);
const AGORA = 1_800_000_000;
const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

function modeloQueResponde(texto: string) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "stream-start", warnings: [] },
          { type: "text-start", id: "t1" },
          { type: "text-delta", id: "t1", delta: texto },
          { type: "text-end", id: "t1" },
          { type: "finish", finishReason: { unified: "stop", raw: undefined }, usage },
        ],
      }),
    }),
  });
}

function requisicao(corpo: unknown, cabecalhos: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost:3000", ...cabecalhos },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
}

const pergunta = (text = "Quais lanches vocês têm?") => ({ messages: [{ role: "user", parts: [{ type: "text", text }] }] });
const deps = (model: MockLanguageModelV4, extra = {}) => ({
  model,
  segredoSessao: SEGREDO,
  producao: false,
  agoraEmSegundos: () => AGORA,
  ...extra,
});

function valorDoCookie(resposta: Response): string {
  const setCookie = resposta.headers.get("set-cookie") ?? "";
  return setCookie.split(";")[0]!.split("=").slice(1).join("=");
}

test("responde em streaming e entrega o cookie com a contagem 1", async () => {
  const model = modeloQueResponde("Temos X-Burger!");
  const resposta = await tratarChat(requisicao(pergunta()), deps(model));

  assert.equal(resposta.status, 200);
  assert.equal(resposta.headers.get("x-respostas-restantes"), "4");
  assert.match(resposta.headers.get("set-cookie") ?? "", /HttpOnly/);
  assert.match(await resposta.text(), /Temos X-Burger!/);
  assert.equal(model.doStreamCalls.length, 1);
});

test("a 6ª pergunta é barrada com 429 e o modelo NÃO é chamado", async () => {
  const model = modeloQueResponde("ok");
  let cookie = "";
  for (let i = 1; i <= 5; i++) {
    const r = await tratarChat(requisicao(pergunta(), cookie ? { cookie: `${NOME_COOKIE}=${cookie}` } : {}), deps(model));
    assert.equal(r.status, 200, `resposta ${i}`);
    await r.text();
    cookie = valorDoCookie(r);
  }
  assert.equal(model.doStreamCalls.length, 5);

  const sexta = await tratarChat(requisicao(pergunta(), { cookie: `${NOME_COOKIE}=${cookie}` }), deps(model));
  assert.equal(sexta.status, 429);
  const corpo = (await sexta.json()) as { codigo: string; restantes: number };
  assert.equal(corpo.codigo, "limite-atingido");
  assert.equal(corpo.restantes, 0);
  assert.equal(model.doStreamCalls.length, 5);
});

test("cookie adulterado não libera mais respostas: vira sessão nova, não aumenta o limite", async () => {
  const model = modeloQueResponde("ok");
  const forjado = `0.${AGORA + 100}.assinatura-falsa`;
  const r = await tratarChat(requisicao(pergunta(), { cookie: `${NOME_COOKIE}=${forjado}` }), deps(model));
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-respostas-restantes"), "4");
  await r.text();
});

test("o histórico enviado pelo cliente não influencia a contagem", async () => {
  const model = modeloQueResponde("ok");
  const cookie = codificarSessao(SEGREDO, { usadas: 5, expiraEm: AGORA + 1000 });
  // Cliente "esconde" o uso mandando histórico vazio: continua barrado pelo cookie.
  const r = await tratarChat(requisicao(pergunta(), { cookie: `${NOME_COOKIE}=${cookie}` }), deps(model));
  assert.equal(r.status, 429);
});

test("corpo inválido: 400. JSON quebrado: 400. Grande demais: 413", async () => {
  const model = modeloQueResponde("ok");
  assert.equal((await tratarChat(requisicao({ messages: [] }), deps(model))).status, 400);
  assert.equal((await tratarChat(requisicao("{quebrado"), deps(model))).status, 400);
  assert.equal((await tratarChat(requisicao("x".repeat(40_000)), deps(model))).status, 413);
  assert.equal(model.doStreamCalls.length, 0);
});

test("origem de outro site é recusada; sem Origin (curl) passa", async () => {
  const model = modeloQueResponde("ok");
  const alheia = await tratarChat(requisicao(pergunta(), { origin: "https://site-malicioso.com" }), deps(model));
  assert.equal(alheia.status, 403);
  const propria = await tratarChat(requisicao(pergunta(), { origin: "http://localhost:3000" }), deps(model));
  assert.equal(propria.status, 200);
  await propria.text();
});

test("sem SESSION_SECRET (ou curto) a rota recusa atender", async () => {
  const model = modeloQueResponde("ok");
  assert.equal((await tratarChat(requisicao(pergunta()), deps(model, { segredoSessao: undefined }))).status, 500);
  assert.equal((await tratarChat(requisicao(pergunta()), deps(model, { segredoSessao: "curto" }))).status, 500);
  assert.equal(model.doStreamCalls.length, 0);
});

test("em produção o cookie é Secure", async () => {
  const model = modeloQueResponde("ok");
  const r = await tratarChat(requisicao(pergunta()), deps(model, { producao: true }));
  assert.match(r.headers.get("set-cookie") ?? "", /Secure/);
  await r.text();
});

test("GET informa as respostas restantes sem chamar o modelo nem mudar a sessão", async () => {
  const consulta = (cookie?: string) =>
    consultarStatus(new Request("http://localhost:3000/api/chat", { headers: cookie ? { cookie: `${NOME_COOKIE}=${cookie}` } : {} }), {
      segredoSessao: SEGREDO,
      agoraEmSegundos: () => AGORA,
    });

  assert.deepEqual(await consulta().json(), { restantes: 5, limite: 5 });
  const tres = codificarSessao(SEGREDO, { usadas: 3, expiraEm: AGORA + 1000 });
  assert.deepEqual(await consulta(tres).json(), { restantes: 2, limite: 5 });
  const cinco = codificarSessao(SEGREDO, { usadas: 5, expiraEm: AGORA + 1000 });
  assert.deepEqual(await consulta(cinco).json(), { restantes: 0, limite: 5 });
  // Cookie forjado vira sessão nova; sem segredo configurado, recusa.
  assert.deepEqual(await consulta(`0.${AGORA + 100}.falso`).json(), { restantes: 5, limite: 5 });
  assert.equal(consultarStatus(new Request("http://localhost/api/chat"), { segredoSessao: undefined }).status, 500);
  assert.equal(consulta().headers.get("set-cookie"), null);
});

test("limite por IP: 429 com retry-after, sem chamar o modelo e sem mexer na sessão", async () => {
  const model = modeloQueResponde("ok");
  const r = await tratarChat(
    requisicao(pergunta()),
    deps(model, { limitarIp: async () => ({ limitado: true, retryAfterSegundos: 42 }) }),
  );
  assert.equal(r.status, 429);
  assert.equal(r.headers.get("retry-after"), "42");
  assert.equal(r.headers.get("set-cookie"), null);
  const corpo = (await r.json()) as { codigo: string };
  assert.equal(corpo.codigo, "muitas-requisicoes");
  assert.equal(model.doStreamCalls.length, 0);
});

test("IP liberado segue o fluxo normal", async () => {
  const model = modeloQueResponde("ok");
  const r = await tratarChat(requisicao(pergunta()), deps(model, { limitarIp: async () => ({ limitado: false }) }));
  assert.equal(r.status, 200);
  await r.text();
});

test("provedor sem cota (429) vira a mensagem de sobrecarga, sem vazar detalhes", async () => {
  const model = new MockLanguageModelV4({
    doStream: async () => {
      throw Object.assign(new Error("Quota exceeded for project 123456 key=ABC"), { name: "AI_APICallError", statusCode: 429 });
    },
  });
  const r = await tratarChat(requisicao(pergunta()), deps(model));
  const texto = await r.text();
  assert.match(texto, /muito uso agora/);
  assert.doesNotMatch(texto, /123456|key=ABC|Quota/);
});

test("registra o consumo em tokens, sem texto da conversa nem IP", async () => {
  const linhas: string[] = [];
  const original = console.info;
  console.info = (...args: unknown[]) => void linhas.push(args.map(String).join(" "));
  try {
    const model = modeloQueResponde("resposta secreta do atendente");
    const r = await tratarChat(requisicao(pergunta("minha pergunta privada"), { "x-real-ip": "7.7.7.7" }), deps(model));
    await r.text();
    await new Promise((resolve) => setTimeout(resolve, 20)); // onEnd roda ao fim do stream
  } finally {
    console.info = original;
  }
  const uso = linhas.find((l) => l.includes("chat-uso"));
  assert.ok(uso, "deveria registrar uma linha chat-uso");
  const dados = JSON.parse(uso) as Record<string, unknown>;
  assert.equal(typeof dados.passos, "number");
  assert.equal(typeof dados.entrada, "number");
  assert.doesNotMatch(uso, /privada|secreta|7\.7\.7\.7|demo_sessao/);
});

test("erro do modelo vira mensagem genérica, sem vazar detalhes", async () => {
  const model = new MockLanguageModelV4({
    doStream: async () => {
      throw Object.assign(new Error("detalhe interno secreto https://api/x?key=ABC"), { name: "AI_APICallError", statusCode: 403 });
    },
  });
  const r = await tratarChat(requisicao(pergunta()), deps(model));
  const texto = await r.text();
  assert.match(texto, /Não consegui responder agora/);
  assert.doesNotMatch(texto, /secreto|key=ABC/);
});
