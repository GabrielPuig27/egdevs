export type CategoriaItem = "lanche" | "porcao" | "bebida" | "sobremesa";

export interface ItemCardapio {
  id: string;
  nome: string;
  categoria: CategoriaItem;
  /** Em centavos, para evitar erro de arredondamento em somas. */
  precoCentavos: number;
  ingredientes: string[];
  vegetariano: boolean;
  disponivel: boolean;
}

export interface RegrasLanchonete {
  horario: string;
  entrega: string;
  taxaEntregaCentavos: number;
  pedidoMinimoEntregaCentavos: number;
  pagamento: string[];
}

export interface CatalogoLanchonete {
  nome: string;
  itens: ItemCardapio[];
  regras: RegrasLanchonete;
}
