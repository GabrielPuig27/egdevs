/**
 * Ponte entre os botões "Tenho interesse" (serviços, planos e pacotes) e o formulário de contato:
 * o botão avisa qual opção foi escolhida e o formulário a pré-seleciona. Sem o aviso (ou sem JavaScript),
 * o botão continua sendo um link normal para a seção de contato.
 */
export const INTEREST_EVENT = "egdevs:interesse";

export interface InterestDetail {
  /** Valor de uma opção de `interestOptions`. */
  service: string;
  /** Texto inicial da mensagem, ex.: "Tenho interesse em: Site institucional". */
  message?: string;
}

export function announceInterest(detail: InterestDetail) {
  window.dispatchEvent(new CustomEvent<InterestDetail>(INTEREST_EVENT, { detail }));
}
