import type { TicketCategory, TicketPriority, TicketStatus } from "@/data/types";

export const STATUS_LABEL: Record<TicketStatus, string> = {
  novo: "Novo",
  triagem: "Triagem",
  aguardando_atendimento: "Aguardando atendimento",
  em_andamento: "Em andamento",
  aguardando_solicitante: "Aguardando solicitante",
  resolvido: "Resolvido",
  encerrado: "Encerrado",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
};

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  internet: "Internet e rede",
  impressora: "Impressora",
  acesso: "Acesso a sistemas",
  hardware: "Computador",
  equipamento: "Solicitação de equipamento",
  email: "E-mail",
  outro: "Outro",
};

export const STATUS_LIST = Object.keys(STATUS_LABEL) as TicketStatus[];
export const PRIORITY_LIST = Object.keys(PRIORITY_LABEL) as TicketPriority[];
export const CATEGORY_LIST = Object.keys(CATEGORY_LABEL) as TicketCategory[];

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} d`;
}

export function openFor(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))} min`;
  if (h < 48) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

export type SlaState = "ok" | "atencao" | "vencido" | "concluido";

export function slaState(slaLimite: string, status: TicketStatus): SlaState {
  if (status === "resolvido" || status === "encerrado") return "concluido";
  const restante = new Date(slaLimite).getTime() - Date.now();
  if (restante <= 0) return "vencido";
  if (restante <= 2 * 3600000) return "atencao";
  return "ok";
}

export function slaCountdown(slaLimite: string) {
  const ms = new Date(slaLimite).getTime() - Date.now();
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  const texto = h > 0 ? `${h}h ${m}min` : `${m}min`;
  return ms < 0 ? `${texto} em atraso` : `${texto} restantes`;
}

export function minutesToText(min: number) {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}min` : `${h}h`;
}
