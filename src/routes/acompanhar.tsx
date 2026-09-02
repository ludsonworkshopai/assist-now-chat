import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LifeBuoy, Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingState } from "@/components/common/states";
import { SlaIndicator, StatusBadge } from "@/components/tickets/badges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findByNumber } from "@/data/api";
import { CATEGORY_LABEL, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/acompanhar")({
  validateSearch: (search: Record<string, unknown>) => ({
    numero: typeof search.numero === "string" ? search.numero : "",
  }),
  head: () => ({
    meta: [
      { title: "Acompanhar chamado — Central de TI" },
      { name: "description", content: "Consulte o andamento do seu chamado de TI pelo número informado." },
      { property: "og:title", content: "Acompanhar chamado — Central de TI" },
      { property: "og:description", content: "Veja status, prioridade e histórico do seu chamado." },
    ],
  }),
  component: AcompanharPage,
});

function AcompanharPage() {
  const { numero } = Route.useSearch();
  const navigate = useNavigate();
  const [campo, setCampo] = useState(numero);

  const consulta = useQuery({
    queryKey: ["acompanhar", numero],
    queryFn: () => findByNumber(numero),
    enabled: numero.trim().length > 0,
  });

  return (
    <div className="min-h-screen bg-secondary/50">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold">Central de TI</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Abrir chamado
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold">Acompanhar chamado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe o número recebido ao registrar seu chamado, por exemplo 10240.
        </p>

        <form
          className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/acompanhar", search: { numero: campo.trim() } });
          }}
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="numero">Número do chamado</Label>
            <Input id="numero" value={campo} onChange={(e) => setCampo(e.target.value)} placeholder="#10240" />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4" aria-hidden />
            Consultar
          </Button>
        </form>

        <div className="mt-6">
          {!numero ? (
            <EmptyState
              titulo="Nenhuma consulta ainda"
              descricao="Digite o número do chamado acima para ver o andamento."
            />
          ) : consulta.isLoading ? (
            <LoadingState label="Buscando chamado…" />
          ) : !consulta.data ? (
            <EmptyState
              titulo="Chamado não encontrado"
              descricao="Confira o número informado. Se o problema continuar, abra um novo chamado."
            />
          ) : (
            <Card className="gap-4 p-5 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">{consulta.data.numero}</span>
                <StatusBadge status={consulta.data.status} />
                <SlaIndicator slaLimite={consulta.data.slaLimite} status={consulta.data.status} />
              </div>
              <h2 className="text-lg font-semibold">{consulta.data.titulo}</h2>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Categoria</dt>
                  <dd className="font-medium">{CATEGORY_LABEL[consulta.data.categoria]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Responsável</dt>
                  <dd className="font-medium">{consulta.data.responsavel ?? "Aguardando triagem"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Local</dt>
                  <dd className="font-medium">
                    {consulta.data.unidade} · {consulta.data.local}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Aberto em</dt>
                  <dd className="font-medium">{formatDateTime(consulta.data.criadoEm)}</dd>
                </div>
              </dl>
              <div>
                <h3 className="text-sm font-semibold">Atualizações</h3>
                <ol className="mt-2 space-y-3 border-l pl-4">
                  {consulta.data.timeline
                    .filter((e) => !e.interno)
                    .map((e) => (
                      <li key={e.id} className="relative text-sm">
                        <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <p>{e.mensagem}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.autor} · {formatDateTime(e.data)}
                        </p>
                      </li>
                    ))}
                </ol>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
