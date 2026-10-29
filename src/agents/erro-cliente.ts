import { MENSAGEM_ERRO_MODELO, MENSAGEM_MUITAS_REQUISICOES, MENSAGEM_SOBRECARGA } from "./mensagens.ts";

/**
 * Transforma o erro do useChat numa frase segura para mostrar ao visitante. O erro pode ser:
 *  - o texto que o servidor mandou dentro do stream (uma das frases de mensagens.ts);
 *  - o corpo JSON de uma resposta recusada antes do stream (ex.: limite por IP);
 *  - qualquer outra coisa (rede, HTML de erro da plataforma).
 * Só as frases conhecidas passam; o resto vira a mensagem genérica, sem vazar detalhes técnicos.
 */
export function mensagemParaOVisitante(erro: unknown): string {
  const texto = erro instanceof Error ? erro.message.trim() : "";
  if (texto === MENSAGEM_SOBRECARGA || texto === MENSAGEM_MUITAS_REQUISICOES) return texto;
  try {
    const corpo: unknown = JSON.parse(texto);
    if (typeof corpo === "object" && corpo !== null && (corpo as { codigo?: unknown }).codigo === "muitas-requisicoes") {
      return MENSAGEM_MUITAS_REQUISICOES;
    }
  } catch {
    // não era JSON: segue para a mensagem genérica
  }
  return MENSAGEM_ERRO_MODELO;
}
