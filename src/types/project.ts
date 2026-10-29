export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  /** Tipo de projeto, ex.: "Loja virtual". */
  category: string;
  /** Participação real no projeto; nunca sugerir autoria integral onde foi parcial. */
  participation: string;
  summary: string;
  image: Screenshot;
  /** Só preencher com URL real e existente. */
  url?: string;
  /** Aparece na seção "Projetos em destaque" da home. */
  featured?: boolean;
}
