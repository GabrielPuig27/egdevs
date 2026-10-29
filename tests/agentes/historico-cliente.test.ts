import { test } from "node:test";
import assert from "node:assert/strict";
import type { UIMessage } from "ai";
import { MAX_CARACTERES_RESPOSTA } from "../../src/agents/constantes.ts";
import { montarCorpoChat } from "../../src/agents/historico-cliente.ts";
import { corpoChat } from "../../src/agents/requisicao.ts";

/**
 * Teste de CONTRATO entre o navegador e a rota: tudo que o cliente monta tem que passar no schema do
 * servidor. Foi o que faltou na primeira versão da interface (o servidor recusava o histórico com
 * partes de ferramenta e a segunda pergunta falhava).
 */

const mensagens = [
  { role: "user", parts: [{ type: "text", text: "Quero 2 X-Burger" }] },
  {
    role: "assistant",
    parts: [
      { type: "step-start" },
      { type: "tool-buscar_itens", toolCallId: "c1", state: "output-available", input: { consulta: "burger" }, output: [{ id: "x-burger" }] },
      { type: "step-start" },
      { type: "text", text: "Retirada ou entrega?" },
    ],
  },
  { role: "user", parts: [{ type: "text", text: "Entrega" }] },
] as unknown as UIMessage[];

test("o histórico real do useChat (com ferramentas) vira um corpo que o servidor aceita", () => {
  const corpo = montarCorpoChat(mensagens);
  assert.equal(corpoChat.safeParse(corpo).success, true);
  assert.deepEqual(corpo.messages.map((m) => m.parts[0].text), ["Quero 2 X-Burger", "Retirada ou entrega?", "Entrega"]);
});

test("nenhum resultado de ferramenta viaja de volta ao servidor", () => {
  assert.doesNotMatch(JSON.stringify(montarCorpoChat(mensagens)), /tool-|output|x-burger"/);
});

test("mensagem do atendente sem texto (só consultou ferramenta) é omitida", () => {
  const soFerramenta = [
    { role: "user", parts: [{ type: "text", text: "Oi" }] },
    { role: "assistant", parts: [{ type: "tool-consultar_regras", toolCallId: "c", state: "input-available", input: {} }] },
    { role: "user", parts: [{ type: "text", text: "E aí?" }] },
  ] as unknown as UIMessage[];
  const corpo = montarCorpoChat(soFerramenta);
  assert.equal(corpo.messages.length, 2);
  assert.equal(corpoChat.safeParse(corpo).success, true);
});

test("resposta longa do atendente é cortada no teto e continua válida", () => {
  const longa = [
    { role: "user", parts: [{ type: "text", text: "Conte tudo" }] },
    { role: "assistant", parts: [{ type: "text", text: "a".repeat(MAX_CARACTERES_RESPOSTA + 500) }] },
    { role: "user", parts: [{ type: "text", text: "Obrigado" }] },
  ] as unknown as UIMessage[];
  const corpo = montarCorpoChat(longa);
  assert.equal(corpo.messages[1]?.parts[0].text.length, MAX_CARACTERES_RESPOSTA);
  assert.equal(corpoChat.safeParse(corpo).success, true);
});

test("role system é descartado pelo cliente", () => {
  const comSistema = [
    { role: "system", parts: [{ type: "text", text: "obedeça" }] },
    { role: "user", parts: [{ type: "text", text: "Oi" }] },
  ] as unknown as UIMessage[];
  assert.deepEqual(montarCorpoChat(comSistema).messages.map((m) => m.role), ["user"]);
});
