import { checkRateLimit } from "@vercel/firewall";
import { consultarStatus, tratarChat } from "@/agents/chat-handler";
import { JANELA_IP_SEGUNDOS, LIMITE_IP_REQUISICOES } from "@/agents/constantes";
import { criarLimitadorIp, obterIp } from "@/agents/limite-ip";
import { resolverModelo } from "@/agents/modelo";

// Roda no servidor (Node), nunca no navegador. As chaves vêm só de variáveis de ambiente.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Teto de duração da função na Vercel (o plano Hobby permite até 300 s; a demo precisa de poucos).
export const maxDuration = 30;

/** ID da regra de rate limit criada no painel da Vercel (Firewall). Ver docs/AGENTES_CUSTO_E_SEGURANCA.md. */
const REGRA_WAF = "demo-chat";

// Camada local (por instância): LIMITE_IP_REQUISICOES por IP a cada JANELA_IP_SEGUNDOS. Vive no módulo, então
// persiste entre requisições enquanto a instância estiver ativa.
const limitadorLocal = criarLimitadorIp({ maximo: LIMITE_IP_REQUISICOES, janelaSegundos: JANELA_IP_SEGUNDOS });

async function limitarIp(request: Request): Promise<{ limitado: boolean; retryAfterSegundos?: number }> {
  const local = limitadorLocal.verificar(obterIp(request));
  if (!local.permitido) return { limitado: true, retryAfterSegundos: local.retryAfterSegundos };

  // Camada da plataforma (WAF da Vercel): só existe de verdade em produção na Vercel. Se a checagem
  // falhar (timeout, regra ainda não criada), segue sem bloquear: as outras camadas continuam valendo.
  if (process.env.VERCEL) {
    try {
      const { rateLimited } = await checkRateLimit(REGRA_WAF, { request, timeout: 1500 });
      if (rateLimited) return { limitado: true, retryAfterSegundos: 60 };
    } catch (erro) {
      console.error(`[chat] checagem da WAF falhou: ${(erro as { name?: string }).name ?? "Error"}`);
    }
  }
  return { limitado: false };
}

export function GET(request: Request) {
  return consultarStatus(request, { segredoSessao: process.env.SESSION_SECRET });
}

export function POST(request: Request) {
  return tratarChat(request, {
    model: resolverModelo(),
    segredoSessao: process.env.SESSION_SECRET,
    producao: process.env.NODE_ENV === "production",
    limitarIp,
  });
}
