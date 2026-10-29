/**
 * Mensagens que o SERVIDOR devolve ao visitante. Ficam num arquivo sem dependências porque o
 * navegador também as reconhece (erro-cliente.ts): só estas frases, nunca texto de erro bruto,
 * chegam à tela.
 */

export const MENSAGEM_ERRO_MODELO = "Não consegui responder agora. Tente de novo em instantes.";
export const MENSAGEM_SOBRECARGA = "A demonstração está com muito uso agora. Tente novamente em alguns minutos.";
export const MENSAGEM_MUITAS_REQUISICOES = "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";
