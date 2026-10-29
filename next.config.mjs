import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/**
 * Cabeçalhos de segurança (só em produção: o dev do Next precisa de eval e websocket).
 * 'unsafe-inline' em script/estilo é necessário: o Next injeta scripts de hidratação inline e o
 * Chakra/Emotion gera estilos em runtime. Tudo o mais é restrito à própria origem; o site não
 * carrega scripts, fontes, imagens nem iframes de terceiros e não usa cookies.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

/**
 * O dev usa .next-dev e o build usa .next: rodar `yarn build` com o `yarn dev` aberto
 * não corrompe mais o servidor de desenvolvimento (erro "Cannot find module ./vendor-chunks/...").
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
const nextConfig = (phase) => {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    reactStrictMode: true,
    poweredByHeader: false,
    distDir: dev ? ".next-dev" : ".next",
    async headers() {
      return dev ? [] : [{ source: "/:path*", headers: securityHeaders }];
    },
  };
};

export default nextConfig;
