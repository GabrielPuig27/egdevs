import { ImageResponse } from "next/og";
import { logoGeometry } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { brand } from "@/theme/brand";

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
          backgroundImage: "radial-gradient(circle at 85% 20%, rgba(249,115,22,0.5) 0%, rgba(11,15,26,0) 55%), radial-gradient(circle at 100% 100%, rgba(245,158,11,0.32) 0%, rgba(11,15,26,0) 50%)",
          color: "#F5F7FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="150" height="112" viewBox={logoGeometry.viewBox}>
            <defs>
              <linearGradient id="e" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="26" y2="53">
                {brand.logoStops.map((s) => (
                  <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                ))}
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
