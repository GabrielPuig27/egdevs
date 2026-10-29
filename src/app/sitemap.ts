import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/projetos` },
    { url: `${siteConfig.url}/agentes` },
    { url: `${siteConfig.url}/privacidade` },
  ];
}
