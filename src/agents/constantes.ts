/**
 * Constantes compartilhadas entre servidor e navegador. Sem dependências de propósito:
 * a interface as importa sem arrastar zod, node:crypto nem o AI SDK para o bundle.
 */

/** Respostas do modelo liberadas por sessão de demonstração. */
export const LIMITE_RESPOSTAS = 5;

/** Tamanho máximo de cada mensagem do visitante. */
export const MAX_CARACTERES_MENSAGEM = 500;

/**
 * Tamanho máximo de uma resposta do atendente reenviada no histórico. A resposta do modelo é limitada
 * a 500 tokens (≈ 2.000 caracteres em português), então este teto cobre uma resposta legítima inteira.
 */
export const MAX_CARACTERES_RESPOSTA = 2500;

/** Cookie que conta as respostas da demonstração (assinado, HttpOnly). */
export const NOME_COOKIE = "demo_sessao";

/** Validade do cookie, em segundos: 24 horas fixas a partir da primeira mensagem. */
export const VALIDADE_SEGUNDOS = 24 * 60 * 60;

/** Limite local por IP: no máximo LIMITE_IP_REQUISICOES por janela de JANELA_IP_SEGUNDOS. */
export const LIMITE_IP_REQUISICOES = 20;
export const JANELA_IP_SEGUNDOS = 600;

/**
 * Quem processa as mensagens do visitante. A política de privacidade e o aviso do chat usam este nome:
 * ao trocar de provedor (ex.: Claude Haiku 5.5), atualize aqui e revise src/content/privacidade.ts.
 */
export const PROVEDOR_MODELO = "Google";
