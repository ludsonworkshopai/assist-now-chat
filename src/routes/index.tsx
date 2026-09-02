import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info, LifeBuoy, Send, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatBubble, QuickReplies, TypingBubble } from "@/components/chat/chat-parts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createTicket, findIncident, unidadesList } from "@/data/api";
import type { TicketCategory, TicketPriority } from "@/data/types";
import { CATEGORY_LABEL } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de TI — Abrir chamado em poucos minutos" },
      {
        name: "description",
        content:
          "Registre seu chamado de TI conversando com o assistente da Central de TI. Simples, rápido e sem formulários longos.",
      },
      { property: "og:title", content: "Central de TI — Abrir chamado em poucos minutos" },
      {
        property: "og:description",
        content: "Converse com o assistente virtual e registre seu chamado de TI em poucos passos.",
      },
    ],
  }),
  component: PublicChat,
});

type Etapa = "problema" | "detalhe" | "urgencia" | "local" | "contato" | "confirmacao" | "enviando" | "sucesso";

interface Mensagem {
  id: string;
  autor: "assistente" | "usuario";
  texto: string;
}

const CATEGORIAS: { rotulo: string; categoria: TicketCategory; pergunta: string; opcoes: string[] }[] = [
  {
    rotulo: "Meu computador não liga",
    categoria: "hardware",
    pergunta: "Entendi. O computador chega a acender alguma luz ou ficar totalmente sem reação?",
    opcoes: ["Totalmente sem reação", "Acende luz, mas não inicia", "Liga e desliga sozinho"],
  },
  {
    rotulo: "Problema com internet",
    categoria: "internet",
    pergunta: "Certo. Como está a conexão neste momento?",
    opcoes: ["Sem conexão nenhuma", "Conexão cai o tempo todo", "Muito lenta", "Só a VPN não funciona"],
  },
  {
    rotulo: "Não consigo acessar um sistema",
    categoria: "acesso",
    pergunta: "Qual mensagem aparece quando você tenta acessar?",
    opcoes: ["Senha bloqueada", "Usuário sem permissão", "A página não carrega", "Outra mensagem"],
  },
  {
    rotulo: "Impressora com erro",
    categoria: "impressora",
    pergunta: "O que está acontecendo com a impressora?",
    opcoes: ["Papel atolado", "Aparece offline", "Sem toner ou tinta", "Imprime com falhas"],
  },
  {
    rotulo: "Solicitar equipamento",
    categoria: "equipamento",
    pergunta: "Qual equipamento você precisa?",
    opcoes: ["Notebook", "Monitor", "Headset", "Celular corporativo", "Outro item"],
  },
  {
    rotulo: "Outro problema",
    categoria: "outro",
    pergunta: "Pode me contar um pouco mais sobre o que está acontecendo?",
    opcoes: ["Problema com e-mail", "Computador lento", "Preciso de ajuda com um programa"],
  },
];

const URGENCIA_OPCOES = [
  "Sim, estou totalmente parado",
  "Atrapalha, mas consigo trabalhar",
  "Não é urgente, posso aguardar",
];

const PRIORIDADE_POR_IMPACTO: Record<string, TicketPriority> = {
  "Sim, estou totalmente parado": "critica",
  "Atrapalha, mas consigo trabalhar": "media",
  "Não é urgente, posso aguardar": "baixa",
};

const ETAPA_NUMERO: Partial<Record<Etapa, number>> = {
  problema: 1,
  detalhe: 2,
  urgencia: 2,
  local: 3,
  contato: 4,
  confirmacao: 4,
};

function id() {
  return Math.random().toString(36).slice(2);
}

function PublicChat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "m0",
      autor: "assistente",
      texto: "Olá! Vou ajudar você a registrar seu chamado. O que está acontecendo?",
    },
  ]);
  const [etapa, setEtapa] = useState<Etapa>("problema");
  const [digitando, setDigitando] = useState(false);
  const [entrada, setEntrada] = useState("");
  const [opcoes, setOpcoes] = useState<string[]>(CATEGORIAS.map((c) => c.rotulo));
  const [aviso, setAviso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [numeroGerado, setNumeroGerado] = useState<string | null>(null);

  const [dados, setDados] = useState({
    categoria: "outro" as TicketCategory,
    problema: "",
    detalhe: "",
    impacto: "",
    unidade: "",
    local: "",
    contato: "",
  });

  const fimRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensagens, digitando, etapa]);

  function push(autor: Mensagem["autor"], texto: string) {
    setMensagens((m) => [...m, { id: id(), autor, texto }]);
  }

  function responderAssistente(texto: string, novasOpcoes: string[], proxima: Etapa) {
    setDigitando(true);
    setOpcoes([]);
    window.setTimeout(() => {
      setDigitando(false);
      push("assistente", texto);
      setOpcoes(novasOpcoes);
      setEtapa(proxima);
    }, 650);
  }

  function enviar(valor: string) {
    const texto = valor.trim();
    if (!texto) return;
    push("usuario", texto);
    setEntrada("");

    if (etapa === "problema") {
      const escolhida =
        CATEGORIAS.find((c) => c.rotulo === texto) ??
        CATEGORIAS.find((c) => detectarCategoria(texto) === c.categoria) ??
        CATEGORIAS[5]!;
      setDados((d) => ({ ...d, categoria: escolhida.categoria, problema: texto }));
      const incidente = findIncident(escolhida.categoria);
      setAviso(incidente ? incidente.mensagem : null);
      responderAssistente(escolhida.pergunta, escolhida.opcoes, "detalhe");
      return;
    }

    if (etapa === "detalhe") {
      setDados((d) => ({ ...d, detalhe: texto }));
      responderAssistente("Isso está impedindo você de trabalhar agora?", URGENCIA_OPCOES, "urgencia");
      return;
    }

    if (etapa === "urgencia") {
      setDados((d) => ({ ...d, impacto: texto }));
      responderAssistente(
        "Onde você está para o atendimento? Escolha a unidade ou descreva o local.",
        unidadesList,
        "local",
      );
      return;
    }

    if (etapa === "local") {
      if (!dados.unidade) {
        setDados((d) => ({ ...d, unidade: texto }));
        responderAssistente(
          "Anotado. Em qual andar, setor ou sala você está? Se for atendimento remoto, é só dizer.",
          ["Atendimento remoto", "1º andar", "2º andar", "3º andar", "Recepção"],
          "local",
        );
        return;
      }
      setDados((d) => ({ ...d, local: texto }));
      responderAssistente(
        "Por último: qual seu nome e e-mail ou ramal para contato?",
        [],
        "contato",
      );
      return;
    }

    if (etapa === "contato") {
      setDados((d) => ({ ...d, contato: texto }));
      responderAssistente("Confira o resumo abaixo antes de enviar. Está tudo certo?", [], "confirmacao");
      return;
    }
  }

  function detectarCategoria(texto: string): TicketCategory {
    const t = texto.toLowerCase();
    if (/(internet|wi-?fi|rede|vpn|conex)/.test(t)) return "internet";
    if (/(impressora|imprim|toner)/.test(t)) return "impressora";
    if (/(acesso|senha|login|sistema|erp|crm)/.test(t)) return "acesso";
    if (/(computador|notebook|pc|monitor|teclado|lento|liga)/.test(t)) return "hardware";
    if (/(equipamento|solicit|novo notebook|headset)/.test(t)) return "equipamento";
    if (/(e-?mail|outlook|caixa)/.test(t)) return "email";
    return "outro";
  }

  async function confirmar() {
    setEtapa("enviando");
    setErro(null);
    try {
      const ticket = await createTicket({
        titulo: dados.problema.slice(0, 80),
        descricao: `${dados.problema}\n\nDetalhe informado: ${dados.detalhe}`,
        categoria: dados.categoria,
        subcategoria: dados.detalhe.slice(0, 60),
        prioridade: PRIORIDADE_POR_IMPACTO[dados.impacto] ?? "media",
        solicitante: dados.contato.split(/[,·-]/)[0]?.trim() || "Solicitante",
        contato: dados.contato,
        unidade: dados.unidade || "Não informada",
        local: dados.local || "Não informado",
        impacto: dados.impacto || "Não informado",
      });
      setNumeroGerado(ticket.numero);
      setEtapa("sucesso");
    } catch {
      setErro("Não conseguimos registrar o chamado agora. Tente novamente em instantes.");
      setEtapa("confirmacao");
    }
  }

  function reiniciar() {
    setMensagens([
      {
        id: id(),
        autor: "assistente",
        texto: "Olá! Vou ajudar você a registrar seu chamado. O que está acontecendo?",
      },
    ]);
    setEtapa("problema");
    setOpcoes(CATEGORIAS.map((c) => c.rotulo));
    setDados({
      categoria: "outro",
      problema: "",
      detalhe: "",
      impacto: "",
      unidade: "",
      local: "",
      contato: "",
    });
    setAviso(null);
    setNumeroGerado(null);
  }

  const etapaAtual = ETAPA_NUMERO[etapa] ?? 4;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold">Central de TI</span>
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Acesso da equipe de TI
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        {etapa === "sucesso" ? (
          <section className="flex flex-1 items-center justify-center py-10">
            <Card className="w-full max-w-lg items-center p-8 text-center animate-fade-in">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
                <CheckCircle2 className="h-7 w-7" aria-hidden />
              </span>
              <h1 className="mt-4 text-xl font-semibold">Chamado registrado com sucesso</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Seu chamado é o <strong className="text-foreground">{numeroGerado}</strong>. Guarde esse número
                para acompanhar o andamento.
              </p>
              <p className="mt-3 rounded-lg bg-accent/60 px-4 py-3 text-sm text-accent-foreground">
                A equipe de TI já recebeu sua solicitação e vai retornar assim que fizer a triagem. Chamados que
                impedem o trabalho são priorizados.
              </p>
              <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link to="/acompanhar" search={{ numero: numeroGerado ?? "" }}>
                    Acompanhar chamado
                  </Link>
                </Button>
                <Button variant="outline" onClick={reiniciar}>
                  Abrir outro chamado
                </Button>
              </div>
            </Card>
          </section>
        ) : (
          <>
            <div className="flex items-center gap-3 pt-5 pb-1">
              <Progress value={(etapaAtual / 4) * 100} className="h-1.5 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">Etapa {etapaAtual} de 4</span>
            </div>

            <div className="flex-1 space-y-4 py-4" aria-live="polite">
              {mensagens.map((m) => (
                <ChatBubble key={m.id} autor={m.autor}>
                  {m.texto}
                </ChatBubble>
              ))}

              {aviso && etapa !== "confirmacao" ? (
                <div className="ml-10.5 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground animate-fade-in">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <p>{aviso} Você ainda pode registrar seu chamado, se preferir.</p>
                </div>
              ) : null}

              {digitando ? <TypingBubble /> : null}
              {!digitando && etapa !== "confirmacao" && etapa !== "enviando" ? (
                <QuickReplies opcoes={opcoes} onSelect={enviar} />
              ) : null}

              {etapa === "confirmacao" || etapa === "enviando" ? (
                <Card className="ml-0 gap-3 p-5 animate-fade-in sm:ml-10.5">
                  <h2 className="text-sm font-semibold">Resumo do chamado</h2>
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <Resumo rotulo="Categoria" valor={CATEGORY_LABEL[dados.categoria]} />
                    <Resumo rotulo="Urgência" valor={dados.impacto || "Não informada"} />
                    <Resumo rotulo="Resumo do problema" valor={`${dados.problema} — ${dados.detalhe}`} />
                    <Resumo rotulo="Local" valor={`${dados.unidade} · ${dados.local}`} />
                    <Resumo rotulo="Contato" valor={dados.contato} />
                  </dl>
                  {erro ? (
                    <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {erro}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                    <Button onClick={confirmar} disabled={etapa === "enviando"}>
                      {etapa === "enviando" ? "Enviando…" : "Enviar chamado"}
                    </Button>
                    <Button variant="ghost" onClick={reiniciar} disabled={etapa === "enviando"}>
                      Recomeçar
                    </Button>
                  </div>
                </Card>
              ) : null}

              <div ref={fimRef} />
            </div>

            <form
              className="sticky bottom-0 flex items-center gap-2 border-t bg-background/90 py-3 backdrop-blur"
              onSubmit={(e) => {
                e.preventDefault();
                enviar(entrada);
              }}
            >
              <Input
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Escreva sua resposta…"
                aria-label="Mensagem para o assistente"
                disabled={etapa === "confirmacao" || etapa === "enviando"}
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Enviar mensagem"
                disabled={!entrada.trim() || etapa === "confirmacao" || etapa === "enviando"}
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </form>
            <p className="flex items-center justify-center gap-1.5 pb-4 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Suas informações são usadas apenas para o atendimento interno de TI.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function Resumo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="font-medium">{valor || "—"}</dd>
    </div>
  );
}
