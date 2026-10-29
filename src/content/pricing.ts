import type { Bundle, Money, Offer } from "@/types/pricing";

/**
 * FONTE ÚNICA dos preços. Cards, pacotes e qualquer outro lugar do site leem daqui; nada de valor
 * escrito à mão em componentes. São referências comerciais iniciais, não preços definitivos: o valor
 * final depende do escopo combinado em proposta.
 */

const brl = new Intl.NumberFormat("pt-BR");

/** Valor e prefixo separados, para a interface destacar o número: { prefix: "A partir de", value: "R$ 5.000" }. */
export function moneyParts({ min, max, from }: Money): { prefix?: string; value: string } {
  if (max !== undefined) return { value: `R$ ${brl.format(min)}–${brl.format(max)}` };
  return { prefix: from ? "A partir de" : undefined, value: `R$ ${brl.format(min)}` };
}

/** "R$ 2.000–3.000", "A partir de R$ 5.000" ou "R$ 2.500". */
export function formatMoney(money: Money): string {
  const { prefix, value } = moneyParts(money);
  return prefix ? `${prefix} ${value}` : value;
}

// ---- Implantação (pagamento único) ---------------------------------------------------------
export const oneTimeServices: readonly Offer[] = [
  {
    id: "site-institucional",
    serviceId: "sites",
    name: "Site institucional",
    description: "Ideal para apresentar a empresa com um site profissional.",
    price: { min: 2000, max: 3000 },
    includes: [
      "Design responsivo (celular, tablet e computador)",
      "Páginas com os conteúdos do seu negócio",
      "Formulário de contato ou botão de WhatsApp",
      "SEO básico, publicação e configuração",
    ],
  },
  {
    id: "site-personalizado",
    serviceId: "sites",
    name: "Site personalizado",
    description: "Mais recursos e identidade própria para o seu negócio.",
    price: { min: 3500, max: 6000 },
    includes: [
      "Design exclusivo",
      "Páginas e funcionalidades personalizadas",
      "Catálogo de produtos ou serviços",
      "Integrações específicas, avaliadas no escopo",
      "Suporte na implantação",
    ],
  },
  {
    id: "ecommerce-sistema",
    serviceId: "sistemas",
    name: "E-commerce ou sistema complexo",
    description: "Para lojas virtuais e sistemas sob medida.",
    price: { min: 5000, from: true },
    includes: [
      "Escopo definido em conversa e registrado em proposta",
      "Funcionalidades sob medida para o seu processo",
      "Integrações necessárias, avaliadas antes da contratação",
    ],
    notes: ["O valor final depende da complexidade do projeto."],
  },
  {
    id: "agente-ia-simples",
    serviceId: "agentes-ia",
    name: "Agente de IA simples",
    description: "Implantação de um atendente virtual com escopo definido.",
    price: { min: 1000, max: 1800 },
    includes: [
      "Baseado nas informações do seu negócio",
      "Respostas às dúvidas mais comuns dos clientes",
      "Escopo de atendimento definido antes da implantação",
      "Teste e implantação",
    ],
  },
  {
    id: "agente-ia-integrado",
    serviceId: "agentes-ia",
    name: "Agente de IA integrado",
    description: "Implantação de um agente conectado a outras ferramentas.",
    price: { min: 2000, max: 4000 },
    includes: [
      "Tudo do agente simples",
      "Integrações com sistemas ou canais, avaliadas antes da contratação",
      "Coleta de informações dos clientes",
      "Fluxos personalizados",
      "Teste e implantação",
    ],
  },
  {
    id: "trafego-configuracao",
    serviceId: "trafego-pago",
    name: "Configuração inicial de tráfego pago",
    description: "A base para começar a anunciar com método.",
    price: { min: 500, max: 1000 },
    includes: [
      "Planejamento da campanha",
      "Configuração das contas de anúncio",
      "Criação dos anúncios",
      "Público-alvo segmentado",
      "Rastreamento de conversões",
    ],
    notes: ["A verba de anúncios não está incluída."],
  },
];

// ---- Planos mensais ------------------------------------------------------------------------
export const monthlyPlans: readonly Offer[] = [
  {
    id: "manutencao-essencial",
    serviceId: "manutencao",
    name: "Manutenção essencial",
    description: "Para manter o site no ar, atualizado e seguro.",
    price: { min: 249, max: 349 },
    includes: ["Manutenção e atualizações do site", "Suporte para problemas e dúvidas", "Escopo detalhado em proposta"],
  },
  {
    id: "manutencao-pro",
    serviceId: "manutencao",
    name: "Manutenção Pro",
    description: "Manutenção com horas mensais para evoluir o site.",
    price: { min: 399, max: 599 },
    includes: ["Manutenção e atualizações do site", "Até 2 horas de melhorias por mês", "Suporte para problemas e dúvidas"],
  },
  {
    id: "manutencao-ampliada",
    serviceId: "manutencao",
    name: "Manutenção ampliada",
    description: "Mais horas de melhorias para sites em evolução constante.",
    price: { min: 699, max: 999 },
    includes: ["Manutenção e atualizações do site", "Até 4 horas de melhorias por mês", "Suporte para problemas e dúvidas"],
  },
  {
    id: "suporte-agente-basico",
    serviceId: "agentes-ia",
    name: "Suporte de agente de IA básico",
    description: "Acompanhamento do agente de IA simples.",
    price: { min: 249, max: 399 },
    includes: ["Acompanhamento do funcionamento do agente", "Ajustes nas respostas e nas informações do negócio"],
  },
  {
    id: "suporte-agente-integrado",
    serviceId: "agentes-ia",
    name: "Suporte de agente de IA integrado",
    description: "Acompanhamento do agente de IA com integrações.",
    price: { min: 449, max: 899 },
    includes: ["Acompanhamento do agente e das integrações", "Ajustes nas respostas, fluxos e informações do negócio"],
  },
  {
    id: "gestao-trafego",
    serviceId: "trafego-pago",
    name: "Gestão de tráfego pago",
    description: "Gestão mensal das campanhas de anúncios.",
    price: { min: 700, max: 1200 },
    includes: ["Gestão e otimização das campanhas", "Relatório de resultados"],
    notes: ["A verba de anúncios não está incluída."],
  },
];

// ---- Pacotes integrados --------------------------------------------------------------------
export const bundles: readonly Bundle[] = [
  {
    id: "presenca-digital",
    name: "Presença Digital",
    composition: "Site + Manutenção",
    description: "Para negócios que precisam de uma presença digital profissional.",
    setup: { min: 2500 },
    recurring: [{ label: "Mensalidade", price: { min: 399 } }],
    includes: ["Site institucional completo", "Manutenção mensal do site"],
    notes: ["Valores de referência; o escopo final é definido em proposta."],
  },
  {
    id: "site-agente-ia",
    name: "Site + Agente de IA",
    composition: "Site + Agente de IA",
    description: "Site profissional e atendimento automático para os clientes.",
    setup: { min: 3500, max: 4500 },
    recurring: [{ label: "Mensalidade", price: { min: 649, max: 899 } }],
    includes: ["Site personalizado", "Agente de IA com escopo de atendimento definido", "Suporte e ajustes mensais"],
    notes: ["Integrações adicionais devem ser avaliadas antes da contratação."],
  },
  {
    id: "site-trafego",
    name: "Site + Tráfego Pago",
    composition: "Site + Tráfego Pago",
    description: "Site pronto para receber o público que chega pelos anúncios.",
    setup: { min: 2500, max: 3500 },
    recurring: [
      { label: "Gestão de tráfego", price: { min: 700, max: 1200 } },
      { label: "Manutenção do site (opcional)", price: { min: 249, from: true } },
    ],
    includes: ["Site institucional", "Configuração inicial das campanhas", "Gestão mensal de tráfego pago"],
    notes: ["A verba de anúncios não está incluída."],
  },
  {
    id: "presenca-atendimento-aquisicao",
    name: "Presença + Atendimento + Aquisição",
    composition: "Site + Agente de IA + Tráfego Pago",
    description: "A combinação completa para atrair, atender e acompanhar clientes.",
    setup: { min: 4000, max: 5500 },
    recurring: [{ label: "Mensalidade", price: { min: 1099, max: 1799 } }],
    includes: ["Site", "Agente de IA", "Gestão de tráfego pago"],
    notes: [
      "O escopo deve especificar os limites de suporte, integrações e campanhas.",
      "A verba de anúncios não está incluída.",
    ],
    highlight: true,
  },
];

export const pricingDisclaimer =
  "Valores de referência iniciais, não preços definitivos: o orçamento final depende do escopo combinado em proposta.";

/** Todas as ofertas avulsas, para consulta por id (ex.: pré-seleção do formulário de contato). */
export const allOffers: readonly Offer[] = [...oneTimeServices, ...monthlyPlans];
