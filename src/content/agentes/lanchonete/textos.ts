import { LIMITE_RESPOSTAS, PROVEDOR_MODELO } from "../../../agents/constantes.ts";

/** Textos da interface da demonstração. Centralizados aqui para permitir i18n depois. */
export const textosLanchonete = {
  pagina: {
    titulo: "Teste um agente de IA",
    descricao:
      "Esta é a demonstração de um atendente virtual para uma lanchonete fictícia. A conversa é livre: você escreve do seu jeito e ele responde com o cardápio e as regras da loja.",
    metaTitulo: "Teste um agente de IA",
    metaDescricao:
      "Demonstração de um atendente virtual com IA para uma lanchonete fictícia: consulta o cardápio, calcula o pedido e segue as regras da loja.",
    capacidades: [
      { icone: "chat", titulo: "Responde dúvidas", texto: "Cardápio, ingredientes, preços e opções vegetarianas." },
      { icone: "cart", titulo: "Monta o pedido", texto: "Calcula o total, com ou sem entrega, sem errar a conta." },
      { icone: "calendar", titulo: "Segue as regras da loja", texto: "Horário, taxa de entrega, pedido mínimo e pagamento." },
    ],
    aviso: `Cardápio, preços e regras são fictícios. A conversa é processada por um modelo de IA (${PROVEDOR_MODELO}): não digite dados pessoais.`,
  },
  chat: {
    nome: "Lanchonete Central",
    papel: "Atendente virtual · demonstração",
    papelCurto: "Atendente virtual",
    rotuloConversa: "Conversa com o atendente",
    vazio: "Pergunte sobre o cardápio ou comece um pedido. Por exemplo:",
    sugestoes: ["O que tem de vegetariano?", "Quero 2 X-Burger e uma batata frita", "Vocês entregam? Qual a taxa?"],
    campo: "Sua mensagem",
    aviso: `Conversa processada por IA (${PROVEDOR_MODELO}). Não digite dados pessoais.`,
    politica: "Política de privacidade",
    placeholder: "Escreva aqui",
    enviar: "Enviar",
    parar: "Parar",
    escrevendo: "O atendente está escrevendo",
    tentarDeNovo: "Tentar de novo",
    voce: "Você",
    atendente: "Atendente",
    ferramentas: {
      buscar_itens: { andamento: "Consultando o cardápio", feito: "Consultou o cardápio" },
      calcular_pedido: { andamento: "Calculando o pedido", feito: "Calculou o pedido" },
      consultar_regras: { andamento: "Consultando as regras da loja", feito: "Consultou as regras da loja" },
    },
  },
  home: {
    titulo: "Atendimento com IA",
    texto:
      "Um atendente virtual que consulta os dados da loja e responde em linguagem natural. Preços e totais vêm dos dados do negócio, não da memória do modelo.",
    demo: `A demonstração usa uma lanchonete fictícia. Você conversa de verdade e tem ${LIMITE_RESPOSTAS} respostas para testar.`,
    testar: "Testar o agente",
    contratar: "Quero um para o meu negócio",
    rotuloExemplo: "Exemplo de conversa com o atendente",
    legendaExemplo: "Trecho real de uma conversa da demonstração. Cardápio e preços fictícios.",
    exemplo: {
      pergunta: "Quero 2 X-Burger e uma batata frita, para entrega. Quanto fica?",
      ferramentas: ["buscar_itens", "calcular_pedido"],
      resposta:
        "O seu pedido com 2 X-Burgers (R$ 44,00) e 1 Batata Frita (R$ 18,00), mais a taxa de entrega de R$ 6,00, fica em **R$ 68,00**. Gostaria de confirmar e fechar o pedido?",
    },
  },
  fim: {
    titulo: "A demonstração acabou",
    texto: `Você usou as ${LIMITE_RESPOSTAS} respostas. Quer um atendente assim, com o cardápio e as regras do seu negócio? Fale com a gente.`,
    whatsapp: "Falar pelo WhatsApp",
    contato: "Fale conosco",
    email: "Enviar e-mail",
    emailAssunto: "Quero um agente de IA para o meu negócio",
  },
} as const;

/** Versão compacta para telas estreitas. */
export function rotuloRestantesCurto(restantes: number | null): string {
  if (restantes === null) return `${LIMITE_RESPOSTAS} respostas`;
  return restantes === 1 ? "1 restante" : `${restantes} restantes`;
}

export function rotuloRestantes(restantes: number | null): string {
  if (restantes === null) return `${LIMITE_RESPOSTAS} respostas na demonstração`;
  if (restantes === 1) return "1 resposta restante";
  return `${restantes} respostas restantes`;
}
