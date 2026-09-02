export type TicketStatus =
  | "novo"
  | "triagem"
  | "aguardando_atendimento"
  | "em_andamento"
  | "aguardando_solicitante"
  | "resolvido"
  | "encerrado";

export type TicketPriority = "baixa" | "media" | "alta" | "critica";

export type TicketCategory =
  | "internet"
  | "impressora"
  | "acesso"
  | "hardware"
  | "equipamento"
  | "email"
  | "outro";

export interface TimelineEvent {
  id: string;
  tipo: "criacao" | "atribuicao" | "comentario" | "status" | "resolucao" | "prioridade";
  autor: string;
  mensagem: string;
  data: string; // ISO
  interno?: boolean;
}

export interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  categoria: TicketCategory;
  subcategoria: string;
  equipamento?: string;
  status: TicketStatus;
  prioridade: TicketPriority;
  solicitante: string;
  contato: string;
  unidade: string;
  local: string;
  responsavel: string | null;
  criadoEm: string; // ISO
  atualizadoEm: string; // ISO
  slaLimite: string; // ISO
  primeiraRespostaMin: number | null;
  resolucaoMin: number | null;
  tags: string[];
  impacto: string;
  timeline: TimelineEvent[];
}

export interface Analyst {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  unidade: string;
  disponivel: boolean;
}

export interface Article {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: TicketCategory;
  visualizacoes: number;
  atualizadoEm: string;
}

export interface Incident {
  id: string;
  categoria: TicketCategory;
  unidade: string;
  mensagem: string;
  ativo: boolean;
}
