import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChartNoAxesColumn,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { signOut, type SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/app/chamados", label: "Chamados", icon: TicketIcon },
  { to: "/app/novo", label: "Novo chamado", icon: Plus },
  { to: "/app/base-conhecimento", label: "Base de conhecimento", icon: BookOpen },
  { to: "/app/relatorios", label: "Relatórios", icon: ChartNoAxesColumn },
  { to: "/app/equipe", label: "Equipe", icon: Users },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Navegação principal">
      {nav.map((item) => {
        const ativo = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              ativo
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/app" className="flex items-center gap-2.5 px-4 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LifeBuoy className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-display text-base font-semibold">Central de TI</span>
    </Link>
  );
}

export function AppShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto p-3">
          <div className="rounded-lg bg-accent/60 p-3 text-xs text-accent-foreground">
            <p className="font-medium">Ambiente de demonstração</p>
            <p className="mt-1 text-muted-foreground">Dados fictícios para avaliação da experiência.</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-5">
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Brand />
              <NavList onNavigate={() => setMenuAberto(false)} />
            </SheetContent>
          </Sheet>

          <form
            className="relative flex-1 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/app/chamados", search: { q: busca } });
            }}
            role="search"
          >
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
              placeholder="Buscar por número, solicitante, local ou assunto"
              aria-label="Busca global de chamados"
            />
          </form>

          <div className="ml-auto flex items-center gap-1.5">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/app/novo">
                <Plus className="h-4 w-4" aria-hidden />
                Novo chamado
              </Link>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
                  <Bell className="h-5 w-5" aria-hidden />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b px-4 py-3 text-sm font-semibold">Notificações</p>
                <ul className="divide-y text-sm">
                  <li className="px-4 py-3">
                    <p className="font-medium text-destructive">SLA vencido</p>
                    <p className="text-muted-foreground">#10240 · Internet instável no 3º andar</p>
                  </li>
                  <li className="px-4 py-3">
                    <p className="font-medium">Novo chamado crítico</p>
                    <p className="text-muted-foreground">#10255 · Computador não liga</p>
                  </li>
                  <li className="px-4 py-3">
                    <p className="font-medium">Chamado sem responsável</p>
                    <p className="text-muted-foreground">#10251 · Acesso ao CRM negado</p>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" aria-label="Menu do usuário">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {user.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">{user.nome}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.nome}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/configuracoes">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    signOut();
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-6 sm:py-7">{children}</main>
      </div>
    </div>
  );
}
