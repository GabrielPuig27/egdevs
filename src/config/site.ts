/** Identidade e metadados do site. Contatos comerciais ficam em contact.ts. */
export const siteConfig = {
  name: "EGdevs",
  tagline: "Soluções digitais para negócios reais",
  title: "EGdevs — Sites, IA e estratégia para negócios reais",
  description:
    "Sites profissionais, agentes de IA, automações e gestão de tráfego pago para pequenas e médias empresas atraírem mais clientes e crescerem no digital.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt_BR",
} as const;
