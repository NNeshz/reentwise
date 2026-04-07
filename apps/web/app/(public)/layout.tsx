import { ReactNode } from "react";
import { Footer, Navbar } from "@/modules/landing";
import { MotionProvider } from "./motion-provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </MotionProvider>
  );
}
