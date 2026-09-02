import { Bot, User } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatBubble({
  autor,
  children,
}: {
  autor: "assistente" | "usuario";
  children: ReactNode;
}) {
  const bot = autor === "assistente";
  return (
    <div className={cn("flex w-full animate-fade-in gap-2.5", bot ? "justify-start" : "justify-end")}>
      {bot ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          bot
            ? "rounded-tl-sm border bg-card text-card-foreground"
            : "rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        {children}
      </div>
      {!bot ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <User className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex gap-2.5" aria-live="polite" aria-label="Assistente está digitando">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="h-4 w-4" aria-hidden />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-card px-4 py-3">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function QuickReplies({
  opcoes,
  onSelect,
  label = "Sugestões rápidas",
}: {
  opcoes: string[];
  onSelect: (valor: string) => void;
  label?: string;
}) {
  if (!opcoes.length) return null;
  return (
    <div className="flex flex-wrap gap-2 pl-10.5" role="group" aria-label={label}>
      {opcoes.map((o) => (
        <Button
          key={o}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full bg-card text-sm font-normal hover:border-primary hover:text-primary"
          onClick={() => onSelect(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}
