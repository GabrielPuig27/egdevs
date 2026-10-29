import { isStepCount } from "ai";
import { catalogoLanchonete } from "../../content/agentes/lanchonete/catalogo.ts";
import type { CatalogoLanchonete } from "../../types/lanchonete.ts";
import { montarInstrucoes } from "./instructions.ts";
import { criarFerramentasLanchonete } from "./tools.ts";

/** Teto de idas e vindas modelo ↔ ferramentas por mensagem do cliente (evita laço infinito e custo). */
export const MAX_PASSOS = 5;

/** Teto de tokens de cada resposta do modelo. */
export const MAX_TOKENS_RESPOSTA = 500;

/**
 * Tudo que define o agente, menos o modelo. Quem chama escolhe o modelo:
 *   generateText({ model, messages, ...configurarLanchonete() })
 * Assim o mesmo agente roda com modelo real, com mock nos testes e, mais tarde, com o modelo
 * escolhido por configuração.
 */
export function configurarLanchonete(catalogo: CatalogoLanchonete = catalogoLanchonete) {
  return {
    instructions: montarInstrucoes(catalogo.nome),
    tools: criarFerramentasLanchonete(catalogo),
    stopWhen: isStepCount(MAX_PASSOS),
    maxOutputTokens: MAX_TOKENS_RESPOSTA,
  };
}
