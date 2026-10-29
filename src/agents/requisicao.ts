import { z } from "zod";
import type { ModelMessage } from "ai";
import { MAX_CARACTERES_MENSAGEM, MAX_CARACTERES_RESPOSTA } from "./constantes.ts";

export { MAX_CARACTERES_MENSAGEM, MAX_CARACTERES_RESPOSTA };
/** 6 perguntas de ≤ 500 caracteres + 5 respostas de ≤ 2.500 cabem em ~16 mil; o teto dá folga. */
export const MAX_BYTES_CORPO = 32 * 1024;
/** 5 respostas liberadas → no máximo 6 perguntas e 5 respostas no histórico. */
export const MAX_MENSAGENS_HISTORICO = 11;

/**
 * Formato aceito: o mesmo que o useChat usa (UIMessage), mas só com UMA parte de texto por mensagem.
 * Qualquer outra parte (ferramenta, arquivo, imagem, raciocínio) é recusada: o cliente não pode
 * injetar resultados de ferramenta nem anexos. Campos extras (id, metadata) são ignorados.
 * O cliente da demonstração monta esse corpo em historico-cliente.ts (há um teste de contrato).
 */
const parteTexto = (maximo: number) =>
  z.object({
    type: z.literal("text"),
    text: z.string().trim().min(1).max(maximo),
  });

const mensagem = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), parts: z.array(parteTexto(MAX_CARACTERES_MENSAGEM)).length(1) }),
  z.object({ role: z.literal("assistant"), parts: z.array(parteTexto(MAX_CARACTERES_RESPOSTA)).length(1) }),
]);

export const corpoChat = z
  .object({ messages: z.array(mensagem).min(1).max(MAX_MENSAGENS_HISTORICO) })
  .refine((corpo) => corpo.messages.at(-1)?.role === "user", { message: "A última mensagem deve ser do usuário." });

export type CorpoChat = z.infer<typeof corpoChat>;

/** Histórico só de texto, no formato do modelo. Não há como o cliente enviar "system". */
export function paraMensagensDoModelo(corpo: CorpoChat): ModelMessage[] {
  return corpo.messages.map((m) => ({ role: m.role, content: m.parts[0]!.text }));
}
