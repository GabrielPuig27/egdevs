import { createHmac, timingSafeEqual } from "node:crypto";
import { LIMITE_RESPOSTAS, NOME_COOKIE, VALIDADE_SEGUNDOS } from "./constantes.ts";

export { LIMITE_RESPOSTAS, NOME_COOKIE, VALIDADE_SEGUNDOS };

/**
 * Limite de respostas da demo, guardado num cookie ASSINADO (HMAC-SHA256).
 * O visitante lê o valor, mas não consegue aumentá-lo nem forjá-lo sem o segredo do servidor.
 * Limite conhecido: quem apaga o cookie recomeça do zero. Quem fecha esse buraco é o rate limit
 * por IP e o orçamento da API, não este cookie.
 */

export interface EstadoSessao {
  /** Quantas respostas do modelo já foram liberadas nesta sessão. */
  usadas: number;
  /** Fim da janela, em segundos desde 1970. Fixado na primeira mensagem e nunca estendido. */
  expiraEm: number;
}

function assinar(segredo: string, usadas: number, expiraEm: number): string {
  return createHmac("sha256", segredo).update(`${usadas}.${expiraEm}`).digest("base64url");
}

export function codificarSessao(segredo: string, estado: EstadoSessao): string {
  return `${estado.usadas}.${estado.expiraEm}.${assinar(segredo, estado.usadas, estado.expiraEm)}`;
}

/** Cookie ausente, adulterado ou vencido vira uma sessão nova (equivale a apagar o cookie). */
export function lerSessao(segredo: string, valor: string | undefined, agora: number): EstadoSessao {
  const nova: EstadoSessao = { usadas: 0, expiraEm: agora + VALIDADE_SEGUNDOS };
  if (!valor) return nova;

  const partes = valor.split(".");
  if (partes.length !== 3) return nova;
  const [textoUsadas, textoExpira, assinatura] = partes as [string, string, string];
  if (!/^\d{1,3}$/.test(textoUsadas) || !/^\d{1,12}$/.test(textoExpira)) return nova;

  const usadas = Number(textoUsadas);
  const expiraEm = Number(textoExpira);
  const esperada = Buffer.from(assinar(segredo, usadas, expiraEm));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return nova;
  if (expiraEm <= agora) return nova;

  return { usadas, expiraEm };
}

export function lerCookie(cabecalho: string | null, nome: string): string | undefined {
  if (!cabecalho) return undefined;
  for (const par of cabecalho.split(";")) {
    const indice = par.indexOf("=");
    if (indice === -1) continue;
    if (par.slice(0, indice).trim() === nome) return par.slice(indice + 1).trim();
  }
  return undefined;
}

export function montarSetCookie(valor: string, expiraEm: number, agora: number, seguro: boolean): string {
  const maxAge = Math.max(0, expiraEm - agora);
  // HttpOnly: o JavaScript da página não lê. SameSite=Lax: não vai em requisições de outros sites.
  // Path=/api: só segue para as rotas da API.
  return [`${NOME_COOKIE}=${valor}`, "Path=/api", "HttpOnly", "SameSite=Lax", `Max-Age=${maxAge}`, seguro ? "Secure" : ""]
    .filter(Boolean)
    .join("; ");
}
