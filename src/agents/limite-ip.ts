/**
 * Limite de requisições por IP, em memória. É uma camada de DEFESA EM PROFUNDIDADE, não a principal:
 * em serverless cada instância tem a sua memória, então o limite vale por instância (com Fluid compute
 * as instâncias são reaproveitadas, o que ajuda em rajadas). A camada principal é a regra de rate
 * limit da WAF da Vercel (ver docs/AGENTES_CUSTO_E_SEGURANCA.md). Esta funciona também em desenvolvimento,
 * em preview e antes de a regra da WAF existir.
 */

export interface ResultadoLimite {
  permitido: boolean;
  /** Segundos até a janela reiniciar (só relevante quando bloqueado). */
  retryAfterSegundos: number;
}

interface Opcoes {
  maximo: number;
  janelaSegundos: number;
  /** Teto de IPs guardados, para a memória não crescer sem limite. */
  maxChaves?: number;
  /** Relógio injetável, em milissegundos (para testar). */
  agora?: () => number;
}

/** Janela fixa por IP. */
export function criarLimitadorIp({ maximo, janelaSegundos, maxChaves = 5000, agora = Date.now }: Opcoes) {
  const janelaMs = janelaSegundos * 1000;
  const registros = new Map<string, { inicio: number; contagem: number }>();

  function limpar(agoraMs: number) {
    for (const [chave, r] of registros) if (agoraMs - r.inicio >= janelaMs) registros.delete(chave);
    // Se ainda estiver cheio (muitos IPs distintos na mesma janela), descarta os mais antigos.
    if (registros.size > maxChaves) {
      let sobra = registros.size - Math.floor(maxChaves * 0.9);
      for (const chave of registros.keys()) {
        if (sobra-- <= 0) break;
        registros.delete(chave);
      }
    }
  }

  return {
    verificar(ip: string): ResultadoLimite {
      const agoraMs = agora();
      if (registros.size >= maxChaves) limpar(agoraMs);

      let r = registros.get(ip);
      if (!r || agoraMs - r.inicio >= janelaMs) {
        r = { inicio: agoraMs, contagem: 0 };
        registros.set(ip, r);
      }
      r.contagem += 1;
      const restanteMs = janelaMs - (agoraMs - r.inicio);
      return { permitido: r.contagem <= maximo, retryAfterSegundos: Math.max(1, Math.ceil(restanteMs / 1000)) };
    },
    /** Só para testes. */
    tamanho: () => registros.size,
  };
}

/**
 * IP do visitante. Na Vercel, x-real-ip e x-vercel-forwarded-for são preenchidos pela plataforma e não
 * podem ser forjados pelo cliente. x-forwarded-for entra só como último recurso (fora da Vercel o cliente
 * pode forjá-lo; aqui isso apenas enfraquece o limite local, que é uma camada extra).
 */
export function obterIp(request: Request): string {
  const h = request.headers;
  const candidato = h.get("x-real-ip") ?? h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for")?.split(",")[0];
  const ip = candidato?.trim();
  return ip && ip.length <= 64 ? ip : "desconhecido";
}
