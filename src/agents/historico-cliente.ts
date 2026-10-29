import type { UIMessage } from "ai";
import { MAX_CARACTERES_MENSAGEM, MAX_CARACTERES_RESPOSTA } from "./constantes.ts";

/**
 * Lado do navegador do contrato com a rota: transforma as mensagens do useChat (que carregam partes de
 * ferramenta, "step-start" etc.) no corpo que o servidor aceita, só com o texto. As chamadas de
 * ferramenta não viajam de volta: o servidor refaz as consultas se precisar, em vez de confiar
 * em resultados que o cliente poderia ter alterado.
 */
export function montarCorpoChat(messages: readonly Pick<UIMessage, "role" | "parts">[]) {
  const saida: { role: "user" | "assistant"; parts: [{ type: "text"; text: string }] }[] = [];
  for (const m of messages) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const texto = m.parts
      .flatMap((parte) => (parte.type === "text" ? [parte.text] : []))
      .join("\n\n")
      .trim();
    if (!texto) continue; // ex.: mensagem do atendente que só consultou uma ferramenta
    const limite = m.role === "user" ? MAX_CARACTERES_MENSAGEM : MAX_CARACTERES_RESPOSTA;
    saida.push({ role: m.role, parts: [{ type: "text", text: texto.slice(0, limite) }] });
  }
  return { messages: saida };
}
