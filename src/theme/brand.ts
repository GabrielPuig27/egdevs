/**
 * Cores da marca num só lugar, sem dependências: o tema, o logo (SVG), o favicon e a imagem de
 * Open Graph leem daqui. Para trocar o degradê da marca, mude este arquivo (e os SVGs em public/brand/).
 */
export const brand = {
  /** Início e fim do degradê da marca (botões, destaques). */
  from: "#F97316",
  to: "#FBBF24",
  /** Texto sobre o degradê: escuro, porque o laranja/âmbar é claro (contraste ≥ 6:1 nas duas pontas). */
  onBrand: "#0B0F1A",
  /** Degradê do E do logo (de cima para baixo). */
  logoStops: [
    { offset: 0, color: "#EA580C" },
    { offset: 0.55, color: "#F97316" },
    { offset: 1, color: "#FBBF24" },
  ],
  /** Canais RGB das luzes ambientes (primária, secundária, profunda). */
  glow: { primary: "249 115 22", secondary: "245 158 11", deep: "234 88 12" },
} as const;
