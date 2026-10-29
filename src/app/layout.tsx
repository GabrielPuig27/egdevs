import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";

// Inter (OFL), variável em peso, hospedada no projeto: não depende do Google Fonts em build nem em runtime.
const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
};

export const viewport: Viewport = { themeColor: "#0B0F1A", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // O ColorModeScript do Chakra grava data-theme/color-scheme no <html> e uma classe no <body>
    // antes da hidratação; sem suppressHydrationWarning o React acusa mismatch (só em dev).
    <html lang="pt-BR" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
