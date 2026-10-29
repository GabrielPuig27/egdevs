export interface TeamMember {
  name: string;
  role: string;
  links: readonly { label: string; href: string }[];
}

/**
 * Integrantes exibidos na seção "Sobre". Só entra quem tem dados confirmados.
 * PENDENTE: cargo/título e links (GitHub, LinkedIn) de Erick Bernardes, quando forem informados.
 */
export const team: readonly TeamMember[] = [
  {
    name: "Gabriel Puig",
    role: "Desenvolvedor de Software",
    links: [{ label: "GitHub", href: "https://github.com/GabrielPuig27" }],
  },
  { name: "Erick Bernardes", role: "Desenvolvedor", links: [] },
];

export const aboutPrinciples = [
  { title: "Conversa antes do código", text: "Entendemos o seu negócio e o problema real antes de propor qualquer solução." },
  { title: "Escopo claro", text: "O que está incluído, o que não está e quanto custa ficam combinados por escrito." },
  { title: "Responsabilidade técnica", text: "Código organizado, publicação cuidadosa e suporte depois da entrega." },
] as const;
