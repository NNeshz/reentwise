"use client";

import type React from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@reentwise/ui/src/providers/theme-provider";
import { Toaster } from "@reentwise/ui/src/components/sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const AppProviders = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={["light", "dark", "system"]}
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
};
