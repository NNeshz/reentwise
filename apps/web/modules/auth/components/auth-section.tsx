import Image from "next/image";
import { AuthForm } from "./auth-form";

export function AuthSection({ callbackNext }: { callbackNext?: string }) {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.avif"
          alt="Modern real estate home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle Noise Overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-40"
          style={{
            backgroundImage: 'url("/images/noise.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <AuthForm callbackNext={callbackNext} />
      </div>
    </section>
  );
}
