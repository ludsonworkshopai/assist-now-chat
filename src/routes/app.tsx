import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: () => {
    const user = getSession();
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  component: AppLayout,
});

function AppLayout() {
  const { user } = Route.useRouteContext();
  return (
    <AppShell user={user}>
      <Outlet />
    </AppShell>
  );
}
