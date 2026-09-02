import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiTone = "neutral" | "primary" | "success" | "warning" | "danger";

const toneStyle: Record<KpiTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  danger: "bg-destructive/12 text-destructive",
};

export function KpiCard({
  label,
  valor,
  variacao,
  icon: Icon,
  tone = "neutral",
  hint,
  positivoEhBom = true,
}: {
  label: string;
  valor: string | number;
  variacao?: number;
  icon: ComponentType<{ className?: string }>;
  tone?: KpiTone;
  hint?: string;
  positivoEhBom?: boolean;
}) {
  const subiu = (variacao ?? 0) > 0;
  const bom = subiu === positivoEhBom;
  const TrendIcon = variacao === undefined || variacao === 0 ? Minus : subiu ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-0 p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg p-1.5", toneStyle[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">{valor}</p>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {variacao !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              variacao === 0 ? "text-muted-foreground" : bom ? "text-success" : "text-destructive",
            )}
          >
            <TrendIcon className="h-3 w-3" aria-hidden />
            {Math.abs(variacao)}%
          </span>
        ) : null}
        <span>{hint ?? "vs. período anterior"}</span>
      </div>
    </Card>
  );
}
