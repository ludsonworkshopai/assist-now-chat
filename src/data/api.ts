import { queryOptions } from "@tanstack/react-query";

import { analysts, articles, incidents, nextTicketNumber, tickets, unidades } from "./store";
import type { Article, Ticket, TicketCategory, TicketPriority, TicketStatus } from "./types";

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export const ticketsQuery = queryOptions({
  queryKey: ["tickets"],
  queryFn: async (): Promise<Ticket[]> => {
    await delay();
    return clone(tickets);
  },
});

export const ticketQuery = (id: string) =>
  queryOptions({
    queryKey: ["tickets", id],
    queryFn: async (): Promise<Ticket | null> => {
      await delay(260);
      const found = tickets.find((t) => t.id === id || t.numero.replace("#", "") === id.replace("#", ""));
      return found ? clone(found) : null;
    },
  });

export const analystsQuery = queryOptions({
  queryKey: ["analysts"],
  queryFn: async () => {
    await delay(200);
    return clone(analysts);
  },
});

export const articlesQuery = queryOptions({
  queryKey: ["articles"],
  queryFn: async (): Promise<Article[]> => {
    await delay(240);
    return clone(articles);
  },
});

export const unidadesList = unidades;

export function findIncident(categoria: TicketCategory) {
  return incidents.find((i) => i.ativo && i.categoria === categoria) ?? null;
}

function touch(ticket: Ticket) {
  ticket.atualizadoEm = new Date().toISOString();
}

export async function assignTicket(id: string, responsavel: string) {
  await delay(300);
  const t = tickets.find((x) => x.id === id);
  if (!t) throw new Error("Chamado não encontrado");
  t.responsavel = responsavel;
  if (t.status === "novo" || t.status === "triagem") t.status = "em_andamento";
  t.primeiraRespostaMin ??= Math.round((Date.now() - new Date(t.criadoEm).getTime()) / 60000);
  t.timeline.push({
    id: crypto.randomUUID(),
    tipo: "atribuicao",
    autor: responsavel,
    mensagem: `Chamado assumido por ${responsavel}.`,
    data: new Date().toISOString(),
  });
  touch(t);
  return clone(t);
}

export async function updateStatus(id: string, status: TicketStatus, autor: string) {
  await delay(300);
  const t = tickets.find((x) => x.id === id);
  if (!t) throw new Error("Chamado não encontrado");
  t.status = status;
  if (status === "resolvido" || status === "encerrado") {
    t.resolucaoMin ??= Math.round((Date.now() - new Date(t.criadoEm).getTime()) / 60000);
  }
  t.timeline.push({
    id: crypto.randomUUID(),
    tipo: status === "resolvido" ? "resolucao" : "status",
    autor,
    mensagem: `Status alterado para "${status.replace(/_/g, " ")}".`,
    data: new Date().toISOString(),
  });
  touch(t);
  return clone(t);
}

export async function updatePriority(id: string, prioridade: TicketPriority, autor: string) {
  await delay(300);
  const t = tickets.find((x) => x.id === id);
  if (!t) throw new Error("Chamado não encontrado");
  t.prioridade = prioridade;
  t.timeline.push({
    id: crypto.randomUUID(),
    tipo: "prioridade",
    autor,
    mensagem: `Prioridade alterada para ${prioridade}.`,
    data: new Date().toISOString(),
  });
  touch(t);
  return clone(t);
}

export async function addComment(id: string, mensagem: string, interno: boolean, autor: string) {
  await delay(300);
  const t = tickets.find((x) => x.id === id);
  if (!t) throw new Error("Chamado não encontrado");
  t.timeline.push({
    id: crypto.randomUUID(),
    tipo: "comentario",
    autor,
    mensagem,
    interno,
    data: new Date().toISOString(),
  });
  t.primeiraRespostaMin ??= Math.round((Date.now() - new Date(t.criadoEm).getTime()) / 60000);
  touch(t);
  return clone(t);
}

export interface NewTicketInput {
  titulo: string;
  descricao: string;
  categoria: TicketCategory;
  subcategoria?: string;
  prioridade: TicketPriority;
  solicitante: string;
  contato: string;
  unidade: string;
  local: string;
  impacto: string;
}

export async function createTicket(input: NewTicketInput) {
  await delay(700);
  const nowIso = new Date().toISOString();
  const slaHoras =
    input.prioridade === "critica" ? 2 : input.prioridade === "alta" ? 4 : input.prioridade === "media" ? 12 : 24;
  const ticket: Ticket = {
    id: crypto.randomUUID(),
    numero: nextTicketNumber(),
    titulo: input.titulo,
    descricao: input.descricao,
    categoria: input.categoria,
    subcategoria: input.subcategoria ?? "Não classificado",
    status: "novo",
    prioridade: input.prioridade,
    solicitante: input.solicitante,
    contato: input.contato,
    unidade: input.unidade,
    local: input.local,
    responsavel: null,
    criadoEm: nowIso,
    atualizadoEm: nowIso,
    slaLimite: new Date(Date.now() + slaHoras * 3600000).toISOString(),
    primeiraRespostaMin: null,
    resolucaoMin: null,
    tags: [input.categoria],
    impacto: input.impacto,
    timeline: [
      {
        id: crypto.randomUUID(),
        tipo: "criacao",
        autor: input.solicitante,
        mensagem: "Chamado registrado pelo assistente virtual da Central de TI.",
        data: nowIso,
      },
    ],
  };
  tickets.unshift(ticket);
  return clone(ticket);
}

export async function findByNumber(numero: string) {
  await delay(400);
  const alvo = numero.replace("#", "").trim();
  const t = tickets.find((x) => x.numero.replace("#", "") === alvo);
  return t ? clone(t) : null;
}

export async function saveArticle(article: Omit<Article, "visualizacoes" | "atualizadoEm"> & { id?: string }) {
  await delay(400);
  const existing = articles.find((a) => a.id === article.id);
  if (existing) {
    Object.assign(existing, article, { atualizadoEm: new Date().toISOString() });
    return clone(existing);
  }
  const novo: Article = {
    ...article,
    id: crypto.randomUUID(),
    visualizacoes: 0,
    atualizadoEm: new Date().toISOString(),
  };
  articles.unshift(novo);
  return clone(novo);
}
