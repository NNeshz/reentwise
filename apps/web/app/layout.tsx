import type { Metadata } from "next";
import { Geist, Host_Grotesk } from "next/font/google";
import "./global.css";
import { AppProviders } from "./app-providers";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});

export const metadata: Metadata = {
  title: "Reentwise — Recordatorios constantes, pagos asegurados",
  description: "No cobres más, deja esa tarea delegada.",
  verification: {
    other: {
      "facebook-domain-verification": "hci0wgulr1ybujqc9qkpxake93wa78",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${hostGrotesk.variable} ${hostGrotesk.className} ${geist.variable} ${geist.className} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
