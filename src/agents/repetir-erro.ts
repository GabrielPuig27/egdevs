import type { LanguageModelMiddleware } from "ai";

/**
 * Repete UMA vez a chamada ao modelo quando o provedor falha com um dos códigos HTTP informados.
 * Existe por causa do 403 intermitente ("The caller does not have permission") da API Gemini: o retry
 * nativo do AI SDK só cobre erros retentáveis (408, 409, 429, 5xx) e não repete um 403 lançado antes
 * de o stream começar. Qualquer outro erro, e a segunda falha, seguem para o tratamento normal.
 */
export function repetirUmaVezEm(codigos: readonly number[]): LanguageModelMiddleware {
  const repetivel = (erro: unknown) =>
    typeof erro === "object" && erro !== null && "statusCode" in erro && codigos.includes((erro as { statusCode: number }).statusCode);

  return {
    wrapStream: async ({ doStream }) => {
      try {
        return await doStream();
      } catch (erro) {
        if (!repetivel(erro)) throw erro;
        return await doStream();
      }
    },
    wrapGenerate: async ({ doGenerate }) => {
      try {
        return await doGenerate();
      } catch (erro) {
        if (!repetivel(erro)) throw erro;
        return await doGenerate();
      }
    },
  };
}
