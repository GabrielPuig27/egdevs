import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// ---- Iluminação ambiente ------------------------------------------------------------------
// Halos suaves em violeta e azul atrás do conteúdo. Cada seção marca `data-glow="<nome>"`; a luz vive
// em ::before (atrás do conteúdo, sem cliques) e se dissolve nas bordas por máscara, sem emenda.
const rgb = { violet: "124 58 237", blue: "59 130 246", sky: "14 165 233" } as const;
const orb = (w: number, h: number, x: number, y: number, tone: keyof typeof rgb, alpha: number) =>
  `radial-gradient(ellipse ${w}% ${h}% at ${x}% ${y}%, rgb(${rgb[tone]} / ${alpha}) 0%, rgb(${rgb[tone]} / ${+(alpha * 0.5).toFixed(3)}) 32%, rgb(${rgb[tone]} / ${+(alpha * 0.14).toFixed(3)}) 62%, rgb(${rgb[tone]} / 0) 100%)`;
const lights = (...layers: string[]) => ({ background: layers.join(", ") });

const fadeEdges = "linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)";
const fadeBottom = "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)";

/**
 * Único lugar de cores, fontes e tokens da EGdevs.
 * Cores base do mockup (#0B0F1A, #111827, #7C3AED, #3B82F6, #0EA5E9, #F5F7FA, #9CA3AF). Ajustes de contraste:
 * `accent` (#A78BFA) é o violeta claro para texto e ícones sobre fundo escuro (o #7C3AED puro dá ~3,6:1);
 * os botões usam o degradê `brandFrom`→`brandTo` (#6D28D9→#2563EB), com texto branco ≥ 5:1 nas duas pontas.
 */
export const theme = extendTheme({
  config,
  colors: {
    bg: "#0B0F1A",
    bgDeep: "#070A12",
    surface: "#111827",
    surfaceRaised: "#1A2336",
    ink: "#F5F7FA",
    muted: "#9CA3AF",
    accent: "#A78BFA",
    accentHover: "#C4B5FD",
    danger: "#FF8A80",
    // Marca (decorativas, logo, degradês)
    violet: "#7C3AED",
    blue: "#3B82F6",
    sky: "#0EA5E9",
    brandFrom: "#6D28D9",
    brandTo: "#2563EB",
    // Bordas azul-acinzentadas: discreta (repouso), forte (hover) e violeta (ação secundária).
    line: "rgba(148, 163, 184, 0.16)",
    lineStrong: "rgba(148, 163, 184, 0.34)",
    accentLine: "rgba(167, 139, 250, 0.55)",
    accentTint: "rgba(124, 58, 237, 0.16)",
  },
  // O Heading do Chakra traz um tamanho padrão ("xl") que vence o textStyle; sem tamanho, o textStyle manda.
  components: { Heading: { defaultProps: { size: "none" } } },
  radii: { control: "10px", bar: "16px" },
  fonts: {
    heading: "var(--font-inter), system-ui, sans-serif",
    body: "var(--font-inter), system-ui, sans-serif",
  },
  textStyles: {
    small: {
      fontSize: "clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem)",
      fontWeight: 500,
      lineHeight: 1.45,
    },
    body: {
      fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    lead: {
      fontSize: "clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    // Título de seção.
    head: {
      fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
      fontWeight: 800,
      lineHeight: 1.06,
      letterSpacing: "-0.03em",
    },
    // Título do hero.
    display: {
      fontSize: "clamp(2.5rem, 6.2vw, 4.75rem)",
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: "-0.035em",
    },
  },
  layerStyles: {
    card: {
      borderRadius: "bar",
      overflow: "hidden",
      bgColor: "surface",
      bgImage: "linear-gradient(180deg, rgb(148 163 184 / 0.07) 0%, rgb(148 163 184 / 0.02) 100%)",
      boxShadow: "inset 0 0 0 1px rgb(148 163 184 / 0.14), inset 0 1px 0 rgb(255 255 255 / 0.06)",
    },
    panel: {
      borderRadius: "bar",
      overflow: "hidden",
      bgColor: "bgDeep",
      bgImage: "linear-gradient(180deg, rgb(148 163 184 / 0.06) 0%, rgb(148 163 184 / 0) 42%)",
      boxShadow: "inset 0 0 0 1px rgb(148 163 184 / 0.14), inset 0 1px 0 rgb(255 255 255 / 0.06)",
    },
  },
  styles: {
    global: {
      html: { scrollBehavior: "smooth", scrollPaddingTop: "96px", position: "relative" },
      "html, body": { bg: "bg", color: "ink" },
      body: { overflowX: "hidden", position: "relative" },
      "@keyframes rise": {
        from: { opacity: 0, transform: "translateY(24px)" },
        to: { opacity: 1, transform: "none" },
      },
      // Pontinhos de "escrevendo" do chat; só rodam sem prefers-reduced-motion (ver o componente).
      "@keyframes pulso": {
        "0%, 100%": { opacity: 0.25 },
        "50%": { opacity: 1 },
      },
      "@keyframes flutuar": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-6px)" },
      },
      "[data-glow]": { position: "relative", isolation: "isolate" },
      "[data-glow]::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        maskImage: fadeEdges,
        WebkitMaskImage: fadeEdges,
      },
      '[data-glow="hero"]::before': {
        ...lights(orb(60, 80, 78, 38, "violet", 0.3), orb(46, 60, 96, 76, "blue", 0.2), orb(40, 50, 4, 90, "sky", 0.1)),
        maskImage: fadeBottom,
        WebkitMaskImage: fadeBottom,
      },
      '[data-glow="a"]::before': lights(orb(56, 60, 92, 20, "violet", 0.16), orb(50, 50, 0, 80, "blue", 0.12)),
      '[data-glow="b"]::before': lights(orb(56, 60, 6, 30, "blue", 0.15), orb(50, 56, 98, 85, "violet", 0.15)),
      '[data-glow="c"]::before': lights(orb(64, 70, 50, 0, "violet", 0.18), orb(46, 50, 100, 100, "sky", 0.1)),
      '[data-glow="agentes"]::before': lights(orb(62, 78, 90, 46, "violet", 0.2), orb(50, 58, 2, 88, "blue", 0.14)),
      '[data-glow="agentes-home"]::before': lights(orb(60, 64, 8, 46, "violet", 0.17), orb(52, 56, 98, 90, "blue", 0.13)),
      '[data-glow="privacidade"]::before': lights(orb(58, 70, 6, 24, "blue", 0.13), orb(52, 60, 96, 70, "violet", 0.12)),
      "::selection": { bg: "violet", color: "white" },
      ":focus-visible": {
        outline: "2px solid",
        outlineColor: "accent",
        outlineOffset: "3px",
      },
      "@media (prefers-reduced-motion: reduce)": {
        html: { scrollBehavior: "auto" },
        "*": { transitionDuration: "0.01ms !important", animationDuration: "0.01ms !important" },
      },
    },
  },
});
