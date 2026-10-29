# Agentes de IA: custo e proteção contra abuso

Documento da etapa 5 da demonstração de agentes (`/agentes`). Sem segredos: só nomes de variáveis.
Fatos confirmados na documentação oficial da Vercel e do AI SDK estão marcados como **(doc)**; o que é
decisão nossa não leva a marca.

## Camadas de proteção (da mais externa para a mais interna)

| # | Camada | Onde | O que impede |
|---|---|---|---|
| 1 | Regra de rate limit da WAF (`demo-chat`) | Painel da Vercel + `checkRateLimit` na rota | Rajadas de um mesmo IP, antes de qualquer custo |
| 2 | Limite local por IP (20 req / 10 min) | `src/agents/limite-ip.ts` | O mesmo, por instância; vale em dev e preview |
| 3 | Limite de respostas por sessão (5) | Cookie assinado, `src/agents/limite-sessao.ts` | Uso prolongado por um navegador |
| 4 | Tetos por requisição | `requisicao.ts`, `agente.ts` | Mensagem de ≤ 500 caracteres, histórico ≤ 11, ≤ 5 passos, ≤ 500 tokens de saída |
| 5 | Orçamento da chave (AI Gateway) | Painel/CLI da Vercel | Gasto total, mesmo com muitos IPs |

Limites que continuam existindo: quem apaga o cookie recomeça as 5 respostas (camadas 1, 2 e 5 cobrem);
os contadores da WAF são **por região (doc)**; o limite local é por instância; não há teto global diário
sem um armazenamento compartilhado (Redis), que não foi adicionado de propósito.

## Passo a passo no painel da Vercel (feito uma vez, por você)

### 1. Regra de rate limit da WAF
1. Projeto → **Firewall** → **Configure** → **+ New Rule**.
2. Nome: `Demo chat`. Em **If**, escolha `@vercel/firewall` e use **Rate limit ID** = `demo-chat` **(doc)**.
3. Algoritmo **Fixed Window**, janela de **10 minutos**, limite de **20 requisições** (recomendação nossa).
4. **Save Rule** → **Review Changes** → **Publish**.
5. O plano Hobby permite **1 regra** de rate limit por projeto **(doc)**; esta usa a única.

Sem a regra, a rota continua funcionando: a checagem da WAF falha, é registrada nos logs e as outras
camadas seguem valendo.

### 2. Variáveis de ambiente (Project → Settings → Environment Variables)
- `GOOGLE_GENERATIVE_AI_API_KEY` e `SESSION_SECRET` (≥ 32 caracteres, aleatório). Só no servidor.
- Opcional, `AGENTE_MODELO`: sem barra (`gemini-3.5-flash`) chama o Google direto; com barra
  (`google/gemini-3.5-flash`) passa pelo AI Gateway.
- Para usar o Gateway: `AI_GATEWAY_API_KEY` (ou OIDC, automático dentro da Vercel **(doc)**).

### 3. Orçamento (só vale para o AI Gateway)
O Gateway rejeita novas requisições com HTTP 402 depois que o orçamento acaba, e o teto é **mole**: a
requisição que cruza o limite ainda termina **(doc)**. O plano gratuito do Gateway exige uma forma de
pagamento cadastrada antes de usar os créditos **(doc)**. Exemplo de chave com teto e validade
(valores são exemplos, escolha os seus):

```
vercel ai-gateway api-keys create --name demo-agentes --limit 5 --refresh-period monthly --expiration 90d
```

Chamando o Google direto no plano gratuito não há cobrança; não verifiquei se a API do Google oferece
teto de gasto no plano pago, então não conte com isso.

### 4. Previews
Para a checagem da WAF rodar em um preview é preciso habilitar **Protection Bypass for Automation** e
expor as variáveis de sistema **(doc)**. Sem isso, o preview usa só as camadas 2 a 4.

## Plano gratuito do Gemini não sustenta a demo pública (medido em 27/10/2026)

A API devolveu HTTP 429 com a mensagem: `limit: 20 … Generate content requests per day limit exceeded on
Free Tier` para o `gemini-3.5-flash`, com reinício só à meia-noite do horário do Pacífico. Como cada resposta
do atendente faz 2 a 3 requisições ao modelo (consulta de ferramenta + resposta final), a cota gratuita
comporta cerca de **7 a 10 respostas por dia, somando todos os visitantes**. Serve para desenvolver, não
para divulgar a demo. Quando a cota acaba, a interface mostra "A demonstração está com muito uso agora".

Caminhos para produção (decisão do dono do projeto, com cartão):
- Ativar o faturamento do projeto no Google (Tier 1) e continuar no Google direto.
- Usar o AI Gateway com créditos e orçamento na chave (ver seção 3).
Custo de referência, estimativa a partir dos tokens medidos: uma rodada completa da suíte de avaliação
(33 casos) consome ~80 mil tokens de entrada e ~12 mil de saída, na ordem de US$ 0,10 com o preço de
tabela do `gemini-3.5-flash` vigente em 27/10/2026.

## Decisão atual (27/10/2026)

Plano gratuito do Google com `gemini-3.5-flash-lite` (padrão em `src/agents/modelo.ts`). Sem custo e sem
risco financeiro. Limites: cota diária do plano gratuito (confira a coluna RPD em ai.dev/rate-limit) e
latência variável. Ao divulgar em massa, migrar para o Claude Haiku 5.5 (US$ 0,10 por milhão de tokens de
entrada e US$ 0,50 de saída, na página de preços da Anthropic): adicionar o provedor, validar as respostas do novo modelo com a demonstração
e trocar `AGENTE_MODELO`. O Google pré-pago foi descartado porque a conta exige no mínimo R$ 200.

## Acompanhar o consumo
Cada conversa registra uma linha de log com `evento: "chat-uso"`, o modelo, os passos e os tokens de
entrada, saída e raciocínio. Nunca registra texto, IP nem cookie. No Vercel Logs, filtre por `chat-uso`.

## Testar o limite por IP localmente
Depois de `yarn build && yarn start -p 3100`, dispare 21 requisições inválidas (não chamam o modelo):

```
for i in $(seq 1 21); do curl -s -o /dev/null -w "%{http_code} " -X POST http://localhost:3100/api/chat -H "content-type: application/json" -d "{}"; done
```

Esperado: vinte `400` e um `429`.

## O que a interface mostra
- `limite-atingido` (cookie, 5 respostas): cartão "A demonstração acabou" com o convite ao contato.
- `muitas-requisicoes` (IP): mensagem de aguardar, sem encerrar a demonstração.
- Provedor sem cota (429/402): "A demonstração está com muito uso agora".
- Qualquer outro erro: mensagem genérica. Nunca texto bruto do provedor.
