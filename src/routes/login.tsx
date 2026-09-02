import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LifeBuoy, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_EMAIL, DEMO_SENHA, signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso da equipe — Central de TI" },
      { name: "description", content: "Área restrita para analistas, técnicos e gestores da Central de TI." },
      { property: "og:title", content: "Acesso da equipe — Central de TI" },
      { property: "og:description", content: "Entre para acompanhar chamados, SLA e indicadores da operação." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [senha, setSenha] = useState(DEMO_SENHA);
  const [lembrar, setLembrar] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({});
  const [carregando, setCarregando] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    const novos: typeof erros = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) novos.email = "Informe um e-mail corporativo válido.";
    if (senha.length < 6) novos.senha = "A senha deve ter ao menos 6 caracteres.";
    setErros(novos);
    if (Object.keys(novos).length) return;

    setCarregando(true);
    await new Promise((r) => setTimeout(r, 600));
    if (senha !== DEMO_SENHA) {
      setCarregando(false);
      setErros({ geral: "E-mail ou senha incorretos. Use a senha de demonstração informada abaixo." });
      return;
    }
    signIn(email, lembrar);
    navigate({ to: "/app" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold">Central de TI</span>
        </Link>

        <Card className="p-6">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Acesso da equipe</h1>
            <p className="text-sm text-muted-foreground">Entre com seu e-mail corporativo para continuar.</p>
          </div>

          <form className="mt-5 space-y-4" onSubmit={submeter} noValidate>
            {erros.geral ? (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {erros.geral}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!erros.email}
                aria-describedby={erros.email ? "erro-email" : undefined}
              />
              {erros.email ? (
                <p id="erro-email" className="text-xs text-destructive">
                  {erros.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={!!erros.senha}
                  aria-describedby={erros.senha ? "erro-senha" : undefined}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
              {erros.senha ? (
                <p id="erro-senha" className="text-xs text-destructive">
                  {erros.senha}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={lembrar} onCheckedChange={(v) => setLembrar(v === true)} id="lembrar" />
                <span>Lembrar de mim</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setErros({ geral: "Enviamos as instruções de recuperação para seu e-mail." })}
              >
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {carregando ? "Entrando…" : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 rounded-lg bg-accent/60 px-3 py-2 text-xs text-accent-foreground">
            Demonstração: use <strong>{DEMO_EMAIL}</strong> e a senha <strong>{DEMO_SENHA}</strong>.
          </p>
        </Card>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          É colaborador?{" "}
          <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Abrir um chamado
          </Link>
        </p>
      </div>
    </div>
  );
}
