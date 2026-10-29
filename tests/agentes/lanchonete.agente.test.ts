import { test } from "node:test";
import assert from "node:assert/strict";
import { generateText } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { configurarLanchonete, MAX_PASSOS } from "../../src/agents/lanchonete/agente.ts";

/**
 * Estes testes usam um modelo de mentira: nenhuma chamada de rede, nenhum custo.
 * Eles verificam o ENCANAMENTO (o laço modelo ↔ ferramenta), não a qualidade das respostas.
 * A qualidade com o modelo real é medida nas conversas de avaliação (etapa 6).
 */

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};
const fimPorFerramenta = { unified: "tool-calls", raw: undefined } as const;
const fimNormal = { unified: "stop", raw: undefined } as const;

function chamadaDeFerramenta(toolName: string, input: unknown, id = "call-1") {
  return {
    content: [{ type: "tool-call" as const, toolCallId: id, toolName, input: JSON.stringify(input) }],
    finishReason: fimPorFerramenta,
    usage,
    warnings: [],
  };
}

function texto(text: string) {
  return { content: [{ type: "text" as const, text }], finishReason: fimNormal, usage, warnings: [] };
}

test("o agente chama a ferramenta e devolve o resultado dela ao modelo", async () => {
  const model = new MockLanguageModelV4({
    doGenerate: [chamadaDeFerramenta("buscar_itens", { consulta: "bacon" }), texto("O X-Bacon está indisponível hoje.")],
  });

  const resultado = await generateText({
    model,
    messages: [{ role: "user", content: "Tem X-Bacon?" }],
    ...configurarLanchonete(),
  });

  assert.equal(resultado.text, "O X-Bacon está indisponível hoje.");
  assert.equal(model.doGenerateCalls.length, 2);

  // A 2ª chamada ao modelo carrega o que a ferramenta devolveu, vindo do catálogo (não do modelo).
  const segundaChamada = JSON.stringify(model.doGenerateCalls[1]?.prompt);
  assert.match(segundaChamada, /x-bacon/);
  assert.match(segundaChamada, /"disponivel":false/);
});

test("o cardápio não vai nas instruções, só chega por ferramenta", async () => {
  const model = new MockLanguageModelV4({ doGenerate: texto("Olá!") });
  await generateText({ model, messages: [{ role: "user", content: "Oi" }], ...configurarLanchonete() });

  const primeira = JSON.stringify(model.doGenerateCalls[0]?.prompt);
  assert.doesNotMatch(primeira, /X-Burger/);
  assert.doesNotMatch(primeira, /R\$ 22/);
});

test("o laço de ferramentas para no teto de passos", async () => {
  const model = new MockLanguageModelV4({
    doGenerate: async () => chamadaDeFerramenta("consultar_regras", {}),
  });

  await generateText({
    model,
    messages: [{ role: "user", content: "Qual o horário?" }],
    ...configurarLanchonete(),
  });

  assert.equal(model.doGenerateCalls.length, MAX_PASSOS);
});

test("argumento inválido enviado pelo modelo não executa a ferramenta", async () => {
  const model = new MockLanguageModelV4({
    doGenerate: [
      chamadaDeFerramenta("calcular_pedido", { itens: [{ id: "x-burger", quantidade: -1 }], entrega: false }),
      texto("Não consegui calcular."),
    ],
  });

  const resultado = await generateText({
    model,
    messages: [{ role: "user", content: "Quero -1 X-Burger" }],
    ...configurarLanchonete(),
  });

  assert.equal(resultado.text, "Não consegui calcular.");
  // Se a ferramenta tivesse rodado, o total estaria no histórico enviado de volta ao modelo.
  assert.doesNotMatch(JSON.stringify(model.doGenerateCalls[1]?.prompt), /subtotal/);
});
