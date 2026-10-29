/** Valor em reais. `max` define uma faixa ("min–max"); `from` indica "a partir de". */
export interface Money {
  min: number;
  max?: number;
  from?: boolean;
}

/** Categoria do serviço (serve também de opção do formulário de contato). */
export type ServiceId = "sites" | "agentes-ia" | "trafego-pago" | "manutencao" | "automacoes" | "sistemas";

/** Oferta avulsa: implantação (pagamento único) ou plano mensal. */
export interface Offer {
  id: string;
  serviceId: ServiceId;
  name: string;
  /** Uma frase sobre para quem serve. */
  description: string;
  /** Preço principal; com `tiers`, é o da primeira faixa. */
  price: Money;
  /** Faixas de preço (ex.: por verba de anúncios). Quando existem, o card mostra as faixas no lugar de `price`. */
  tiers?: readonly { label: string; price: Money }[];
  includes: readonly string[];
  /** Ressalvas comerciais exibidas junto ao preço. */
  notes?: readonly string[];
}

export interface RecurringItem {
  label: string;
  price: Money;
}

/** Pacote integrado: implantação única + cobrança recorrente em campos distintos. */
export interface Bundle {
  id: string;
  name: string;
  /** Composição, ex.: "Site + Manutenção". */
  composition: string;
  description: string;
  setup: Money;
  recurring: readonly RecurringItem[];
  includes: readonly string[];
  notes: readonly string[];
  highlight?: boolean;
}
