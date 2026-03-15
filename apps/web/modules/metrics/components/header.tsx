"use client";

import { authClient } from "@reentwise/auth/client";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <h1 className="text-6xl text-pretty font-host-grotesk">Hola, {session?.user.name}</h1>
    </div>
  );
}