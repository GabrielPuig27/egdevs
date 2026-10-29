export interface TeamMember {
  name: string;
  role: string;
  links: readonly { label: string; href: string }[];
}

/**
 * Integrantes exibidos na seção "Sobre". Só entra quem tem dados confirmados.
 * PENDENTE: adicionar o segundo integrante (nome, cargo e links) quando os dados forem fornecidos.
 */
export const team: readonly TeamMember[] = [
  {
    name: "Gabriel Puig",
    role: "Desenvolvedor de Software",
    links: [{ label: "GitHub", href: "https://github.com/GabrielPuig27" }],
  },
];

export const aboutPrinciples = [
  { title: "Conversa antes do código", text: "Entendemos o seu negócio e o problema real antes de propor qualquer solução." },
  { title: "Escopo claro", text: "O que está incluído, o que não está e quanto custa ficam combinados por escrito." },
  { title: "Responsabilidade técnica", text: "Código organizado, publicação cuidadosa e suporte depois da entrega." },
] as const;
