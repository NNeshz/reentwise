"use client";

import { landingAboutContent } from "@/modules/landing/data";
import { LANDING_SECTION } from "@/modules/landing/lib/landing-display";
import { LandingAboutStatement } from "./landing-about-statement";

export function About() {
  return (
    <section
      className={`${LANDING_SECTION} flex min-h-[80vh] flex-col items-center justify-center`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center text-center">
        <LandingAboutStatement text={landingAboutContent.statement} />
      </div>
    </section>
  );
}
