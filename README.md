# EGdevs

Site institucional da **EGdevs**, estúdio de soluções digitais (sites, agentes de IA, automações e tráfego pago) para pequenas e médias empresas.

## Stack

Next.js 15 (App Router) · React 18 · TypeScript estrito · Chakra UI **v2** · Yarn 1 · Node 22+ (testado em 24).
Não atualize versões principais (em especial Chakra v2 → v3) sem avaliar o impacto.

## Comandos

```bash
yarn install
yarn dev          # http://localhost:3000
yarn typecheck && yarn lint && yarn test && yarn build
yarn start        # serve o build de produção
```

`yarn test` roda os testes da demonstração de IA (`node --test`, sem rede e sem custo).

## Onde editar cada coisa

| O quê | Arquivo |
|---|---|
| Nome, descrição, URL e SEO | `src/config/site.ts` |
| **WhatsApp e e-mail comerciais** | `src/config/contact.ts` |
| Menu | `src/config/navigation.ts` |
| **Preços, serviços avulsos, planos e pacotes** (fonte única) | `src/content/pricing.ts` |
| Cards de serviços | `src/content/services.ts` |
| Projetos | `src/content/projects.ts` (capturas em `public/images/projects/`) |
| Integrantes e princípios (Sobre) | `src/content/team.ts` |
| Cores, fontes e tokens | `src/theme/index.ts` |
| Logo | `src/components/ui/Logo.tsx` e `public/brand/*.svg` |
| Cores da marca (degradê, logo) | `src/theme/brand.ts` |

Os preços são referências iniciais: o site os apresenta como tal. Altere só em `pricing.ts`; cards, pacotes e o formulário leem de lá.

## Pendências antes de publicar

1. **Contato comercial:** preencher `src/config/contact.ts` (WhatsApp com DDI+DDD e e-mail). Enquanto estiver vazio, o formulário avisa que os canais estão em configuração, e os botões de contato não aparecem. A política de privacidade usa o mesmo e-mail.
2. **Erick Bernardes:** confirmar cargo/título e links em `src/content/team.ts` (hoje aparece como "Desenvolvedor", sem links).
3. **Domínio:** definir `NEXT_PUBLIC_SITE_URL` na hospedagem (sitemap, robots e Open Graph).
4. **Demonstração de IA (`/agentes`):** validada e liberada (indexável e no sitemap). Precisa de `GOOGLE_GENERATIVE_AI_API_KEY` e `SESSION_SECRET` no servidor (ver `.env.example` e `docs/AGENTES_CUSTO_E_SEGURANCA.md`); sem as chaves, o chat responde "serviço indisponível". Antes de divulgar em massa, confira o custo/limites e o plano da hospedagem (ver o doc). A política de privacidade é um **rascunho** feito a partir do comportamento real: revise com um profissional.
5. **Projetos:** sites publicados do portfólio de Gabriel Puig e protótipos demonstrativos (Recicle Auto Peças e Flor & Cor, ainda sem URL pública). Quando tiverem URL, adicione `url` em `src/content/projects.ts`.

## Como o contato funciona

O formulário **não tem backend**: ele monta a mensagem e abre o WhatsApp ou o aplicativo de e-mail. Nada é enviado nem guardado pelo site. Os botões "Tenho interesse" dos preços pré-selecionam o serviço e sugerem a mensagem.

## Segurança

Cabeçalhos (CSP, `X-Frame-Options`, `nosniff` etc.) em `next.config.mjs`, aplicados só em produção. Nenhum segredo no repositório: `.env*` está no `.gitignore` (exceto `.env.example`).
