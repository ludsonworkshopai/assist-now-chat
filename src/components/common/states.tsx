import { AlertTriangle, Inbox, Loader2, SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Carregando…", className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground", className)}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({
  titulo,
  descricao,
  icon,
  action,
}: {
  titulo: string;
  descricao: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card/60 px-6 py-14 text-center">
      <div className="rounded-full bg-accent p-3 text-accent-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <h3 className="text-base font-semibold">{titulo}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{descricao}</p>
      {action}
    </div>
  );
}

export function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<SearchX className="h-5 w-5" aria-hidden />}
      titulo="Nenhum resultado encontrado"
      descricao="Tente ajustar os filtros ou revisar os termos da busca."
      action={
        onClear ? (
          <Button variant="outline" size="sm" onClick={onClear}>
            Limpar filtros
          </Button>
        ) : undefined
      }
    />
  );
}

export function ErrorState({ mensagem, onRetry }: { mensagem?: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
    >
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <h3 className="text-base font-semibold">Não foi possível carregar</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {mensagem ?? "Ocorreu um erro inesperado. Tente novamente em instantes."}
      </p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
