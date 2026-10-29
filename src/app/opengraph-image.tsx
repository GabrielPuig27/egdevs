import { ImageResponse } from "next/og";
import { logoGeometry } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          backgroundColor: "#0B0F1A",
          backgroundImage: "radial-gradient(circle at 85% 20%, rgba(124,58,237,0.55) 0%, rgba(11,15,26,0) 55%), radial-gradient(circle at 100% 100%, rgba(59,130,246,0.4) 0%, rgba(11,15,26,0) 50%)",
          color: "#F5F7FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="150" height="112" viewBox={logoGeometry.viewBox}>
            <defs>
              <linearGradient id="e" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="26" y2="53">
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="0.6" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>
            <g transform="translate(9.3 0) skewX(-10)">
              <path d={logoGeometry.e} fill="url(#e)" />
              <path d={logoGeometry.g} fill="#F5F7FA" />
            </g>
          </svg>
          <div style={{ display: "flex", fontSize: 120, letterSpacing: -4, lineHeight: 1 }}>
            <span style={{ fontWeight: 800 }}>EG</span>
            <span style={{ fontWeight: 400 }}>devs</span>
          </div>
        </div>
        <div style={{ marginTop: 48, fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>Sites, IA e estratégia para negócios reais.</div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#9CA3AF" }}>{siteConfig.tagline}</div>
      </div>
    ),
    size,
  );
}
