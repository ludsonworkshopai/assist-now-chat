import { AlertOctagon, CheckCircle2, Clock, Timer } from "lucide-react";

import type { TicketPriority, TicketStatus } from "@/data/types";
import { PRIORITY_LABEL, STATUS_LABEL, slaCountdown, slaState } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyle: Record<TicketStatus, string> = {
  novo: "bg-info/10 text-info border-info/25",
  triagem: "bg-accent text-accent-foreground border-border",
  aguardando_atendimento: "bg-warning/15 text-warning-foreground border-warning/30",
  em_andamento: "bg-primary/10 text-primary border-primary/25",
  aguardando_solicitante: "bg-muted text-muted-foreground border-border",
  resolvido: "bg-success/12 text-success border-success/30",
  encerrado: "bg-muted text-muted-foreground border-border",
};

const priorityStyle: Record<TicketPriority, string> = {
  baixa: "bg-muted text-muted-foreground border-border",
  media: "bg-info/10 text-info border-info/25",
  alta: "bg-warning/20 text-warning-foreground border-warning/35",
  critica: "bg-destructive/12 text-destructive border-destructive/30",
};

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
  return <span className={cn(base, statusStyle[status], className)}>{STATUS_LABEL[status]}</span>;
}

export function PriorityBadge({ priority, className }: { priority: TicketPriority; className?: string }) {
  return (
    <span className={cn(base, priorityStyle[priority], className)}>
      {priority === "critica" ? <AlertOctagon className="h-3 w-3" aria-hidden /> : null}
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function SlaIndicator({
  slaLimite,
  status,
  className,
}: {
  slaLimite: string;
  status: TicketStatus;
  className?: string;
}) {
  const estado = slaState(slaLimite, status);
  const map = {
    ok: { cls: "bg-success/12 text-success border-success/30", icon: Clock, txt: slaCountdown(slaLimite) },
    atencao: {
      cls: "bg-warning/20 text-warning-foreground border-warning/35",
      icon: Timer,
      txt: slaCountdown(slaLimite),
    },
    vencido: {
      cls: "bg-destructive/12 text-destructive border-destructive/30",
      icon: AlertOctagon,
      txt: slaCountdown(slaLimite),
    },
    concluido: { cls: "bg-muted text-muted-foreground border-border", icon: CheckCircle2, txt: "SLA concluído" },
  } as const;
  const { cls, icon: Icon, txt } = map[estado];
  return (
    <span className={cn(base, cls, className)} title={`SLA: ${txt}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {txt}
    </span>
  );
}
