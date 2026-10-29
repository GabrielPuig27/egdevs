/**
 * Canais comerciais da EGdevs. PREENCHER ANTES DE PUBLICAR: enquanto estiverem vazios, o site não
 * inventa nada; o formulário avisa que os canais estão em configuração e os botões de contato somem.
 *
 * - whatsapp.number: só dígitos, com país e DDD (ex.: 5511999999999).
 * - whatsapp.display: como aparece na tela (ex.: "(11) 99999-9999").
 * - email: endereço comercial (ex.: "contato@seudominio.com.br").
 */
export const contact: { whatsapp: { number: string; display: string }; email: string } = {
  whatsapp: { number: "", display: "" },
  email: "",
};

const whatsappNumber = /^\d{10,15}$/.test(contact.whatsapp.number) ? contact.whatsapp.number : "";
const emailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? contact.email : "";

export const hasWhatsapp = whatsappNumber !== "";
export const hasEmail = emailAddress !== "";
export const hasContactChannel = hasWhatsapp || hasEmail;
export const contactEmail = emailAddress;
export const whatsappDisplay = hasWhatsapp ? contact.whatsapp.display || contact.whatsapp.number : "";

/** Link do WhatsApp com mensagem pronta; `undefined` se o número ainda não foi configurado. */
export function whatsappUrl(message?: string): string | undefined {
  if (!hasWhatsapp) return undefined;
  return `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Link mailto com assunto e corpo opcionais; `undefined` se o e-mail ainda não foi configurado. */
export function emailUrl(subject?: string, body?: string): string | undefined {
  if (!hasEmail) return undefined;
  const params = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&");
  return `mailto:${emailAddress}${params ? `?${params}` : ""}`;
}

/** Destino quando nenhum canal externo existe: a própria seção de contato. */
export const contactSectionHref = "/#contato";

/** Mensagem pronta do convite ao final da demonstração do agente de IA. */
export const agentesMensagem = "Olá! Testei o agente de IA do site da EGdevs e gostaria de conversar sobre um agente para o meu negócio.";
