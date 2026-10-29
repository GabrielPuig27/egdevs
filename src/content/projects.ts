import type { Project, Screenshot } from "@/types/project";

// Fonte única dos projetos. São trabalhos do portfólio de Gabriel Puig, um dos fundadores da EGdevs;
// `participation` descreve a participação real em cada um (nunca autoria integral onde foi parcial).
// Imagens: capturas autorizadas, otimizadas em public/images/projects/<slug>/. Só há URL onde o site existe.

const shot = (slug: string, file: string, alt: string): Screenshot => ({
  src: `/images/projects/${slug}/${file}.webp`,
  alt,
  width: 2000,
  height: 1250,
});

export const projects: readonly Project[] = [
  {
    slug: "espaco-varandas",
    title: "Espaço Varandas",
    category: "Site institucional e catálogo",
    participation: "Desenvolvimento do zero",
    summary: "Site institucional e catálogo visual de mobiliário outdoor, desenvolvido do esboço no Figma ao site final.",
    image: shot("espaco-varandas", "desktop-sobre", "Seção de boas-vindas do site Espaço Varandas em desktop, com foto de cadeira de corda náutica."),
    url: "https://espacovarandas.com.br/",
    featured: true,
  },
  {
    slug: "black-metal-store",
    title: "Black Metal Store",
    category: "Loja virtual",
    participation: "Manutenção e evolução",
    summary: "Manutenção e evolução de uma loja virtual WooCommerce, com integração de pagamentos.",
    image: shot("black-metal-store", "desktop-home-hero", "Página inicial da loja Black Metal Store em desktop."),
    url: "https://blackmetalstore.com",
    featured: true,
  },
  {
    slug: "phonoise",
    title: "Phonoise",
    category: "Landing page",
    participation: "Protótipo publicado",
    summary: "Landing page para uma gravadora de Heavy Metal de São Paulo, com hero, catálogo de lançamentos, atacado e contato.",
    image: shot("phonoise", "desktop-home-hero", "Página inicial da landing page Phonoise em desktop."),
    url: "https://phonoise.vercel.app/",
    featured: true,
  },
  {
    slug: "reymond-solucoes",
    title: "Reymond Soluções",
    category: "Site institucional B2B",
    participation: "Desenvolvimento do zero",
    summary: "Site institucional de automação industrial, com os serviços técnicos organizados em formato comercial.",
    image: shot("reymond-solucoes", "desktop-home-hero", "Página inicial do site Reymond Soluções em desktop."),
    url: "https://reymondsolucoes.com.br/",
  },
  {
    slug: "grafica-donato",
    title: "Gráfica Donato",
    category: "Site institucional",
    participation: "Desenvolvimento do zero",
    summary: "Site institucional de gráfica e editora, com serviços, contato e chamada clara para orçamento.",
    image: shot("grafica-donato", "desktop-home-hero", "Página inicial do site Gráfica Donato em desktop."),
    url: "https://graficadonato.com.br/",
  },
  {
    slug: "blindados-e-o-nome",
    title: "Blindados e o Nome",
    category: "Site comercial",
    participation: "Participação parcial",
    summary: "Continuidade e evolução de um site de veículos blindados que já estava parcialmente desenvolvido.",
    image: shot("blindados-e-o-nome", "desktop-home-hero", "Página inicial do site Blindados e o Nome em desktop."),
    url: "https://blindadoseonome.com.br",
  },
];
