import { ReactNode } from "react";
import { Navbar } from "@/modules/landing/components/navbar";
import { Footer } from "@/modules/landing/components/footer";
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
