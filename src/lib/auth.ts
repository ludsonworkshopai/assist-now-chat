export interface SessionUser {
  nome: string;
  email: string;
  cargo: string;
  iniciais: string;
}

const KEY = "central-ti-sessao";

export const DEMO_EMAIL = "marina.alves@empresa.com.br";
export const DEMO_SENHA = "central123";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY) ?? window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function signIn(email: string, lembrar: boolean): SessionUser {
  const nome = email
    .split("@")[0]!
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const user: SessionUser = {
    nome,
    email,
    cargo: "Analista de Suporte",
    iniciais: nome
      .split(" ")
      .slice(0, 2)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase(),
  };
  const store = lembrar ? window.localStorage : window.sessionStorage;
  store.setItem(KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.sessionStorage.removeItem(KEY);
}
