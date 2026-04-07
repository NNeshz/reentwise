"use client";

import { authClient } from "@reentwise/auth/client";
import { MetricsHeaderTitle } from "./metrics-header-title";
import { MetricsHeaderSubtitle } from "./metrics-header-subtitle";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <MetricsHeaderTitle userName={session?.user.name} />
      <MetricsHeaderSubtitle />
    </div>
  );
}
