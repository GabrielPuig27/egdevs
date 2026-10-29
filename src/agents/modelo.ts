import { google } from "@ai-sdk/google";
import { wrapLanguageModel } from "ai";
import type { LanguageModel } from "ai";
import { repetirUmaVezEm } from "./repetir-erro.ts";

export const MODELO_PADRAO = "gemini-3.5-flash-lite";

export type ModeloConfigurado = { origem: "google" | "gateway"; id: string };

/**
 * Lê AGENTE_MODELO e decide por onde o modelo é chamado:
 *  - "gemini-3.5-flash" (sem barra)  → API do Google direto (GOOGLE_GENERATIVE_AI_API_KEY);
 *  - "google/gemini-3.5-flash" (com barra, formato provedor/modelo) → Vercel AI Gateway
 *    (AI_GATEWAY_API_KEY, ou OIDC dentro da Vercel), que traz orçamento, logs e fallback.
 * Trocar de um para o outro é só mudar essa variável. Valor mal escrito cai no padrão: nunca vira
 * URL ou caminho estranho.
 */
export function interpretarModelo(configurado: string | undefined): ModeloConfigurado {
  const valor = configurado?.trim();
  if (valor && /^[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9.-]*$/.test(valor)) return { origem: "gateway", id: valor };
  if (valor && /^[a-z0-9][a-z0-9.-]{1,60}$/.test(valor)) return { origem: "google", id: valor };
  return { origem: "google", id: MODELO_PADRAO };
}

export function resolverModelo(): LanguageModel {
  const modelo = interpretarModelo(process.env.AGENTE_MODELO);
  // Uma string de modelo é resolvida pelo AI Gateway (que já tem retentativas e fallback próprios).
  if (modelo.origem === "gateway") return modelo.id;
  // Direto no Google: repete uma vez o 403 intermitente, que o retry nativo do SDK não cobre.
  return wrapLanguageModel({ model: google(modelo.id), middleware: repetirUmaVezEm([403]) });
}
