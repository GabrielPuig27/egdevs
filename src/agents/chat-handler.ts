import { createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import type { LanguageModel } from "ai";
import { configurarLanchonete } from "./lanchonete/agente.ts";
import {
  LIMITE_RESPOSTAS,
  NOME_COOKIE,
  codificarSessao,
  lerCookie,
  lerSessao,
  montarSetCookie,
} from "./limite-sessao.ts";
import { MENSAGEM_ERRO_MODELO, MENSAGEM_MUITAS_REQUISICOES, MENSAGEM_SOBRECARGA } from "./mensagens.ts";
import { MAX_BYTES_CORPO, corpoChat, paraMensagensDoModelo } from "./requisicao.ts";

export interface DependenciasChat {
  model: LanguageModel;
  /** Segredo do cookie de sessão (SESSION_SECRET). Sem ele a rota recusa atender. */
  segredoSessao: string | undefined;
  /** Em produção o cookie ganha o atributo Secure. */
  producao: boolean;
  /** Relógio injetável, em segundos desde 1970 (para testar expiração). */
  agoraEmSegundos?: () => number;
  /** Limite por IP (WAF da Vercel + memória local). Roda antes de qualquer trabalho caro. */
  limitarIp?: (request: Request) => Promise<{ limitado: boolean; retryAfterSegundos?: number }>;
}

const MENSAGEM_LIMITE =
  "A demonstração acabou: você usou as 5 respostas disponíveis. Fale comigo para contratar um agente sob medida para o seu negócio.";

/** Provedor sem cota ou com limite de taxa vira "muito uso"; o resto, o erro genérico. Nunca texto bruto. */
function mensagemDoErro(erro: unknown): string {
  const status = (erro as { statusCode?: number } | null)?.statusCode;
  return status === 429 || status === 402 ? MENSAGEM_SOBRECARGA : MENSAGEM_ERRO_MODELO;
}

function json(corpo: Record<string, unknown>, status: number, headers?: HeadersInit): Response {
  return Response.json(corpo, { status, headers: { "cache-control": "no-store", ...headers } });
}

/** Aceita requisições do próprio site. Sem cabeçalho Origin (curl, testes) segue; com ele, precisa bater. */
function origemPermitida(request: Request): boolean {
  const origem = request.headers.get("origin");
  if (!origem) return true;
  try {
    return new URL(origem).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * GET /api/chat: quantas respostas ainda restam nesta sessão. O cookie é HttpOnly (a página não o
 * lê), então a interface pergunta ao servidor ao abrir, para mostrar a contagem certa após recarregar.
 * Não chama o modelo e não altera a sessão.
 */
export function consultarStatus(request: Request, deps: Pick<DependenciasChat, "segredoSessao" | "agoraEmSegundos">): Response {
  const { segredoSessao } = deps;
  if (!segredoSessao || segredoSessao.length < 32) {
    return json({ codigo: "configuracao", mensagem: "Serviço indisponível no momento." }, 500);
  }
  const agora = (deps.agoraEmSegundos ?? (() => Math.floor(Date.now() / 1000)))();
  const sessao = lerSessao(segredoSessao, lerCookie(request.headers.get("cookie"), NOME_COOKIE), agora);
  return json({ restantes: Math.max(0, LIMITE_RESPOSTAS - sessao.usadas), limite: LIMITE_RESPOSTAS }, 200);
}

/**
 * Lógica da rota POST /api/chat, separada do arquivo da rota para poder ser testada com um
 * modelo de mentira. O arquivo da rota só injeta o modelo real e as variáveis de ambiente.
 */
export async function tratarChat(request: Request, deps: DependenciasChat): Promise<Response> {
  const { model, segredoSessao, producao } = deps;
  const agora = (deps.agoraEmSegundos ?? (() => Math.floor(Date.now() / 1000)))();

  if (!segredoSessao || segredoSessao.length < 32) {
    console.error("[chat] SESSION_SECRET ausente ou curto (mínimo 32 caracteres).");
    return json({ codigo: "configuracao", mensagem: "Serviço indisponível no momento." }, 500);
  }

  if (!origemPermitida(request)) {
    return json({ codigo: "origem-invalida", mensagem: "Origem não permitida." }, 403);
  }

  // Limite por IP antes de ler o corpo e de qualquer chamada ao modelo.
  const porIp = await deps.limitarIp?.(request);
  if (porIp?.limitado) {
    return json({ codigo: "muitas-requisicoes", mensagem: MENSAGEM_MUITAS_REQUISICOES }, 429, {
      "retry-after": String(porIp.retryAfterSegundos ?? 60),
    });
  }

  const tamanhoDeclarado = Number(request.headers.get("content-length") ?? 0);
  if (tamanhoDeclarado > MAX_BYTES_CORPO) {
    return json({ codigo: "corpo-grande", mensagem: "Requisição grande demais." }, 413);
  }
  const texto = await request.text();
  if (texto.length > MAX_BYTES_CORPO) {
    return json({ codigo: "corpo-grande", mensagem: "Requisição grande demais." }, 413);
  }

  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return json({ codigo: "requisicao-invalida", mensagem: "Corpo inválido." }, 400);
  }
  const corpo = corpoChat.safeParse(bruto);
  if (!corpo.success) {
    return json({ codigo: "requisicao-invalida", mensagem: "Mensagem inválida." }, 400);
  }

  // Limite de respostas: decidido no servidor, com o cookie assinado. O histórico enviado pelo
  // cliente NÃO conta (ele poderia mentir); só o cookie conta.
  const sessao = lerSessao(segredoSessao, lerCookie(request.headers.get("cookie"), NOME_COOKIE), agora);
  if (sessao.usadas >= LIMITE_RESPOSTAS) {
    return json({ codigo: "limite-atingido", mensagem: MENSAGEM_LIMITE, restantes: 0 }, 429);
  }

  // Conta já no início: abortar a requisição no meio não devolve a resposta (anti-abuso).
  const proxima = { usadas: sessao.usadas + 1, expiraEm: sessao.expiraEm };
  const setCookie = montarSetCookie(codificarSessao(segredoSessao, proxima), proxima.expiraEm, agora, producao);

  const resultado = streamText({
    model,
    messages: paraMensagensDoModelo(corpo.data),
    ...configurarLanchonete(),
    abortSignal: request.signal,
    // Consumo por conversa (só números: nada de texto, IP ou cookie) para acompanhar custo nos logs.
    onEnd: (evento) => {
      const u = evento.usage;
      console.info(
        JSON.stringify({
          evento: "chat-uso",
          modelo: typeof model === "string" ? model : model.modelId,
          passos: evento.steps.length,
          entrada: u.inputTokens ?? null,
          saida: u.outputTokens ?? null,
          raciocinio: u.outputTokenDetails.reasoningTokens ?? null,
        }),
      );
    },
    onError: ({ error }) => {
      // Só nome e status: nunca o objeto inteiro, que pode carregar detalhes da requisição.
      const e = error as { name?: string; statusCode?: number };
      console.error(`[chat] falha do modelo: ${e.name ?? "Error"}${e.statusCode ? ` (HTTP ${e.statusCode})` : ""}`);
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: resultado.stream, onError: mensagemDoErro }),
    headers: {
      "set-cookie": setCookie,
      "cache-control": "no-store",
      "x-respostas-restantes": String(LIMITE_RESPOSTAS - proxima.usadas),
    },
  });
}
