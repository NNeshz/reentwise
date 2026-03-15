import { ReactNode } from "react";
import { Navbar } from "@/modules/landing/components/navbar";
import { Footer } from "@/modules/landing/components/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
