import { Hero } from "@/modules/landing/components/hero";
import { About } from "@/modules/landing/components/about";
import { Stadistics } from "@/modules/landing/components/stadistics";
import { Faq } from "@/modules/landing/components/faq";
import { Cta } from "@/modules/landing/components/cta";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Stadistics />
      <Faq />
      <Cta />
    </div>
  );
}
