/**
 * Margem externa única das seções: 16px no celular, 24px no tablet e, em telas largas, o que sobra
 * além de 1240px de conteúdo (centraliza sem precisar de um contêiner em cada seção).
 * Sem dependências de propósito: importável em componentes de servidor.
 */
export const gutter = { base: 4, md: 6, xl: "max(24px, calc((100% - 1240px) / 2))" } as const;
