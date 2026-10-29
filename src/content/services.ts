import type { IconName } from "@/components/ui/Icon";
import type { ServiceId } from "@/types/pricing";

export interface Service {
  id: ServiceId;
  title: string;
  description: string;
  icon: IconName;
}

/** Os seis serviços da home. O `id` liga o card ao formulário de contato e às ofertas de preço. */
export const services: readonly Service[] = [
  {
    id: "sites",
    title: "Sites profissionais",
    description: "Sites modernos, rápidos e pensados para transformar visitas em conversas com clientes.",
    icon: "monitor",
  },
  {
    id: "agentes-ia",
    title: "Agentes de IA",
    description: "Atendimento inteligente que responde às dúvidas dos clientes com as informações do seu negócio, a qualquer hora.",
    icon: "bot",
  },
  {
    id: "trafego-pago",
    title: "Tráfego pago",
    description: "Campanhas no Google e na Meta para levar pessoas interessadas até o seu negócio.",
    icon: "trend",
  },
  {
    id: "manutencao",
    title: "Manutenção e suporte",
    description: "Seu site atualizado, seguro e funcionando, com alguém para chamar quando precisar.",
    icon: "wrench",
  },
  {
    id: "automacoes",
    title: "Automações e integrações",
    description: "Soluções que conectam as suas ferramentas e economizam tempo em tarefas repetitivas.",
    icon: "sliders",
  },
  {
    id: "sistemas",
    title: "Sistemas personalizados",
    description: "Desenvolvimento sob medida para necessidades que um site comum não resolve.",
    icon: "layers",
  },
];

/** Opções do formulário de contato: os serviços, mais as duas escolhas que não são um serviço. */
export const interestOptions: readonly { value: string; label: string }[] = [
  ...services.map((s) => ({ value: s.id, label: s.title })),
  { value: "pacote", label: "Pacote integrado" },
  { value: "nao-sei", label: "Ainda não sei, quero conversar" },
];
