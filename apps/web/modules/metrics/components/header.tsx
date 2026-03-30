"use client";

import { authClient } from "@reentwise/auth/client";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <h1 className="text-6xl text-pretty font-host-grotesk">Hola, {session?.user.name}</h1>
      <p className="text-sm text-muted-foreground">Aquí puedes ver un resumen de tus propiedades, pagos, inquilinos y más.</p>
    </div>
  );
}