import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// /agentes fica de fora de propósito (noindex) até a demonstração ser validada e divulgada.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url }, { url: `${siteConfig.url}/projetos` }, { url: `${siteConfig.url}/privacidade` }];
}
