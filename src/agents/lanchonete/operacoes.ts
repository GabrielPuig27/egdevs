import type { CatalogoLanchonete, CategoriaItem, ItemCardapio } from "../../types/lanchonete.ts";

/**
 * Lógica de negócio da lanchonete, SEM IA: funções puras sobre o catálogo.
 * É aqui que preço, disponibilidade e total são decididos. O modelo só pede a consulta
 * (via ferramenta) e repete o que ela devolveu, então não tem como inventar um valor.
 */

export function formatarReais(centavos: number): string {
  return `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;
}

/** Minúsculas e sem acento, para "grao" encontrar "Grão-de-Bico". */
function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export interface FiltroBusca {
  consulta?: string | undefined;
  categoria?: CategoriaItem | undefined;
  vegetariano?: boolean | undefined;
}

export interface ItemEncontrado {
  id: string;
  nome: string;
  categoria: CategoriaItem;
  preco: string;
  ingredientes: string[];
  vegetariano: boolean;
  disponivel: boolean;
}

function paraResposta(item: ItemCardapio): ItemEncontrado {
  return {
    id: item.id,
    nome: item.nome,
    categoria: item.categoria,
    preco: formatarReais(item.precoCentavos),
    ingredientes: item.ingredientes,
    vegetariano: item.vegetariano,
    disponivel: item.disponivel,
  };
}

/** Sem filtros, devolve o cardápio inteiro. Itens indisponíveis voltam marcados, não escondidos. */
export function buscarItens(catalogo: CatalogoLanchonete, filtro: FiltroBusca): ItemEncontrado[] {
  const termo = filtro.consulta ? normalizar(filtro.consulta.trim()) : "";
  return catalogo.itens
    .filter((item) => !filtro.categoria || item.categoria === filtro.categoria)
    .filter((item) => filtro.vegetariano === undefined || item.vegetariano === filtro.vegetariano)
    .filter((item) => {
      if (!termo) return true;
      const texto = normalizar([item.id, item.nome, ...item.ingredientes].join(" "));
      return texto.includes(termo);
    })
    .map(paraResposta);
}

export interface LinhaPedido {
  id: string;
  quantidade: number;
}

export interface PedidoCalculado {
  ok: true;
  linhas: { nome: string; quantidade: number; precoUnitario: string; subtotal: string }[];
  subtotal: string;
  taxaEntrega: string;
  total: string;
  entrega: boolean;
}

export interface PedidoRecusado {
  ok: false;
  problemas: string[];
}

export function calcularPedido(
  catalogo: CatalogoLanchonete,
  entrada: { itens: LinhaPedido[]; entrega: boolean },
): PedidoCalculado | PedidoRecusado {
  const problemas: string[] = [];

  // Soma quantidades repetidas do mesmo item.
  const quantidades = new Map<string, number>();
  for (const { id, quantidade } of entrada.itens) {
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      problemas.push(`Quantidade inválida para "${id}".`);
      continue;
    }
    quantidades.set(id, (quantidades.get(id) ?? 0) + quantidade);
  }
  if (quantidades.size === 0 && problemas.length === 0) problemas.push("O pedido está vazio.");

  const linhas: PedidoCalculado["linhas"] = [];
  let subtotalCentavos = 0;
  for (const [id, quantidade] of quantidades) {
    const item = catalogo.itens.find((candidato) => candidato.id === id);
    if (!item) {
      problemas.push(`Item "${id}" não existe no cardápio.`);
      continue;
    }
    if (!item.disponivel) {
      problemas.push(`${item.nome} está indisponível hoje.`);
      continue;
    }
    const subtotalLinha = item.precoCentavos * quantidade;
    subtotalCentavos += subtotalLinha;
    linhas.push({
      nome: item.nome,
      quantidade,
      precoUnitario: formatarReais(item.precoCentavos),
      subtotal: formatarReais(subtotalLinha),
    });
  }

  const { regras } = catalogo;
  if (entrada.entrega && problemas.length === 0 && subtotalCentavos < regras.pedidoMinimoEntregaCentavos) {
    problemas.push(`Pedido mínimo para entrega é ${formatarReais(regras.pedidoMinimoEntregaCentavos)} (sem a taxa).`);
  }
  if (problemas.length > 0) return { ok: false, problemas };

  const taxaCentavos = entrada.entrega ? regras.taxaEntregaCentavos : 0;
  return {
    ok: true,
    linhas,
    subtotal: formatarReais(subtotalCentavos),
    taxaEntrega: formatarReais(taxaCentavos),
    total: formatarReais(subtotalCentavos + taxaCentavos),
    entrega: entrada.entrega,
  };
}

export function consultarRegras(catalogo: CatalogoLanchonete) {
  const { regras } = catalogo;
  return {
    loja: catalogo.nome,
    horario: regras.horario,
    entrega: regras.entrega,
    taxaEntrega: formatarReais(regras.taxaEntregaCentavos),
    pedidoMinimoEntrega: formatarReais(regras.pedidoMinimoEntregaCentavos),
    pagamento: regras.pagamento,
  };
}
