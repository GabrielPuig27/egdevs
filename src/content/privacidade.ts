import {
  JANELA_IP_SEGUNDOS,
  LIMITE_IP_REQUISICOES,
  LIMITE_RESPOSTAS,
  MAX_CARACTERES_MENSAGEM,
  NOME_COOKIE,
  PROVEDOR_MODELO,
  VALIDADE_SEGUNDOS,
} from "../agents/constantes.ts";
import { contactEmail } from "../config/contact.ts";
import { siteConfig } from "../config/site.ts";

/**
 * Política de privacidade da demonstração de agentes de IA. Os números e nomes (cookie, janelas, limites,
 * provedor) vêm das MESMAS constantes que o código usa, então o texto não desatualiza sozinho.
 * Rascunho redigido a partir do comportamento real do sistema: revisar com um profissional do direito
 * antes de usar a demonstração para vender o serviço.
 * Fatos sobre o provedor: no plano gratuito da Gemini API, a Google informa que pode usar o conteúdo
 * enviado para melhorar seus produtos (documentação de billing da Gemini API). Ao migrar de provedor, revisar.
 */

export interface SecaoPrivacidade {
  id: string;
  titulo: string;
  paragrafos?: readonly string[];
  itens?: readonly { titulo: string; texto: string }[];
}

const horas = VALIDADE_SEGUNDOS / 3600;
const minutos = JANELA_IP_SEGUNDOS / 60;
/** Como pedir algo sobre os dados: por e-mail, se já configurado; senão, pelo formulário do site. */
const comoFalar = contactEmail ? `escreva para ${contactEmail}` : "use o formulário de contato do site";

export const privacidade = {
  titulo: "Privacidade",
  resumo:
    "Esta página explica o que acontece com as suas informações no site e, em especial, na demonstração de agente de IA. Em resumo: o site não usa rastreadores nem anúncios, e as suas conversas com o atendente não são guardadas pela EGdevs.",
  atualizadaEm: "29 de outubro de 2026",
  contatoRotulo: "Falar sobre privacidade",
  contatoEmail: contactEmail,
  voltar: "Ver a demonstração",
  secoes: [
    {
      id: "responsavel",
      titulo: "Quem é o responsável",
      paragrafos: [
        `A ${siteConfig.name} é a responsável por este site e pela demonstração. Para qualquer pedido sobre os seus dados, ${comoFalar}.`,
      ],
    },
    {
      id: "abrangencia",
      titulo: "O que esta página cobre",
      paragrafos: [
        "O site apresenta a EGdevs, os serviços, os projetos e os planos. Ele não tem análise de audiência, anúncios nem scripts de terceiros. O formulário de contato não envia nada por conta própria: ele só monta a mensagem e abre o seu WhatsApp ou o seu aplicativo de e-mail, e o envio acontece por lá.",
        "A parte que trata dados é a demonstração do atendente virtual, em /agentes, descrita abaixo.",
      ],
    },
    {
      id: "dados",
      titulo: "Que dados são usados e por quê",
      itens: [
        {
          titulo: "As mensagens que você digita",
          texto: `São enviadas ao provedor do modelo de IA para gerar a resposta do atendente. Cada mensagem tem no máximo ${MAX_CARACTERES_MENSAGEM} caracteres, e a conversa tem ${LIMITE_RESPOSTAS} respostas.`,
        },
        {
          titulo: "O cookie de uso",
          texto: `O cookie ${NOME_COOKIE} conta quantas respostas você já recebeu, para respeitar o limite de ${LIMITE_RESPOSTAS}. Ele guarda só esse número e a data de validade, é assinado para não ser alterado, não é lido pelo JavaScript da página e expira em ${horas} horas. Não identifica você.`,
        },
        {
          titulo: "O endereço IP",
          texto: `Serve para segurança e para evitar abuso: o servidor conta as requisições de cada IP em memória, no máximo ${LIMITE_IP_REQUISICOES} a cada ${minutos} minutos, e a plataforma de hospedagem aplica uma regra de limite equivalente. O IP não é gravado em banco de dados pela EGdevs.`,
        },
        {
          titulo: "O registro de consumo",
          texto: "A cada conversa, o servidor registra apenas números: o modelo usado, a quantidade de passos e a de tokens. Esse registro não contém o texto das mensagens, o IP nem o cookie.",
        },
        {
          titulo: "A preferência de tema",
          texto: "O tema escuro fica guardado no seu navegador (armazenamento local) e não é enviado a ninguém.",
        },
      ],
    },
    {
      id: "base-legal",
      titulo: "Por que podemos tratar esses dados",
      paragrafos: [
        "A conversa com o atendente só acontece se você escolher usá-la e enviar uma mensagem: essa é a base do consentimento (LGPD, art. 7º, I). Você pode parar a qualquer momento, simplesmente fechando a página.",
        "O cookie de uso e a contagem por IP existem para manter a demonstração segura e disponível e para evitar abuso (legítimo interesse, LGPD, art. 7º, IX).",
      ],
    },
    {
      id: "compartilhamento",
      titulo: "Com quem os dados são compartilhados",
      itens: [
        {
          titulo: `${PROVEDOR_MODELO} (provedor do modelo de IA)`,
          texto: `As suas mensagens são enviadas à ${PROVEDOR_MODELO} para gerar as respostas. Na Gemini API em uso gratuito, a ${PROVEDOR_MODELO} informa que pode usar o conteúdo enviado para melhorar os seus produtos. Por isso, não escreva nada que você não queira que seja tratado dessa forma.`,
        },
        {
          titulo: "Vercel (hospedagem)",
          texto: "O site roda na Vercel, que pode manter os registros técnicos de acesso necessários para operar a hospedagem, conforme as políticas dela.",
        },
      ],
      paragrafos: [
        "Esses fornecedores podem processar dados em servidores fora do Brasil. Não vendemos nem cedemos os seus dados para outras finalidades.",
      ],
    },
    {
      id: "conversas",
      titulo: "As conversas não são guardadas pela EGdevs",
      paragrafos: [
        "A demonstração não tem banco de dados. O histórico da conversa existe só na tela do seu navegador e some quando você recarrega ou fecha a página. Por isso, não conseguimos recuperar o conteúdo de uma conversa específica depois dela.",
        "Qualquer cópia que o provedor do modelo mantenha segue as regras dele.",
      ],
    },
    {
      id: "retencao",
      titulo: "Por quanto tempo",
      itens: [
        { titulo: "Cookie de uso", texto: `${horas} horas, contadas a partir da primeira mensagem.` },
        { titulo: "Contagem por IP", texto: `Em memória, por até ${minutos} minutos.` },
        { titulo: "Registro de consumo", texto: "Apenas números, sem dados pessoais, mantidos pelo tempo de retenção dos logs da hospedagem." },
        { titulo: "Mensagens", texto: "Não são guardadas pela EGdevs. A retenção no provedor do modelo segue as regras dele." },
      ],
    },
    {
      id: "direitos",
      titulo: "Os seus direitos",
      paragrafos: [
        `A LGPD (art. 18) garante, entre outros, confirmação do tratamento, acesso, correção, eliminação, informação sobre compartilhamento e revogação do consentimento. Para exercê-los, ${comoFalar}. Respondemos o mais rápido que pudermos.`,
      ],
    },
    {
      id: "cuidados",
      titulo: "Cuidados para você",
      paragrafos: [
        "Não digite dados pessoais, senhas, documentos, dados de saúde ou financeiros na demonstração. O cardápio, os preços e os pedidos são fictícios: nenhum pedido é feito de verdade.",
        "O atendente é um modelo de IA e pode errar. Não use as respostas dele como informação oficial.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "Mudanças nesta página",
      paragrafos: [
        "Se a demonstração mudar a ponto de alterar o tratamento de dados, por exemplo trocando o provedor do modelo, esta página será atualizada, e a data no topo mostra a última revisão.",
      ],
    },
  ],
} as const satisfies {
  titulo: string;
  resumo: string;
  atualizadaEm: string;
  contatoRotulo: string;
  contatoEmail: string;
  voltar: string;
  secoes: readonly SecaoPrivacidade[];
};
