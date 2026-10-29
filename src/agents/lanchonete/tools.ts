import { tool } from "ai";
import { z } from "zod";
import type { CatalogoLanchonete } from "../../types/lanchonete.ts";
import { buscarItens, calcularPedido, consultarRegras } from "./operacoes.ts";

/**
 * Ferramentas que o modelo pode chamar. Cada uma é uma casca fina sobre uma função pura de
 * operacoes.ts. O inputSchema (Zod) é validado pelo SDK ANTES de execute rodar: se o modelo
 * mandar um argumento inválido, a ferramenta nem executa. Os limites (máx. de itens e de
 * quantidade) impedem pedidos absurdos mesmo que alguém consiga induzir o modelo a tentar.
 */
export function criarFerramentasLanchonete(catalogo: CatalogoLanchonete) {
  return {
    buscar_itens: tool({
      description:
        "Consulta o cardápio. Use para responder qualquer pergunta sobre itens, preços, ingredientes, " +
        "opções vegetarianas ou disponibilidade. Sem filtros, devolve o cardápio inteiro. " +
        "Itens com disponivel=false não podem ser vendidos hoje.",
      inputSchema: z.object({
        consulta: z.string().max(80).optional().describe("Parte do nome, id ou ingrediente. Ex.: 'bacon', 'queijo'."),
        categoria: z.enum(["lanche", "porcao", "bebida", "sobremesa"]).optional(),
        vegetariano: z.boolean().optional().describe("true para só vegetarianos."),
      }),
      execute: (entrada) => buscarItens(catalogo, entrada),
    }),

    calcular_pedido: tool({
      description:
        "Calcula o valor de um pedido. Use SEMPRE que o cliente quiser saber o total ou fechar o pedido; " +
        "nunca some valores por conta própria. Use os ids devolvidos por buscar_itens. " +
        "Se devolver ok=false, explique os problemas ao cliente.",
      inputSchema: z.object({
        itens: z
          .array(z.object({ id: z.string().max(60), quantidade: z.number().int().min(1).max(20) }))
          .min(1)
          .max(10),
        entrega: z.boolean().describe("true para entrega (cobra taxa), false para retirada."),
      }),
      execute: (entrada) => calcularPedido(catalogo, entrada),
    }),

    consultar_regras: tool({
      description:
        "Devolve horário de funcionamento, regras e taxa de entrega, pedido mínimo e formas de pagamento.",
      inputSchema: z.object({}),
      execute: () => consultarRegras(catalogo),
    }),
  };
}
