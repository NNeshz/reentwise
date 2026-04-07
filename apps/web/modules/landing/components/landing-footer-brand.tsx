import Image from "next/image";
import Link from "next/link";
import { landingFooterContent } from "@/modules/landing/data";

export function LandingFooterBrand() {
  const c = landingFooterContent;

  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="reentwise Logo"
          width={24}
          height={24}
          className="object-contain dark:invert"
        />
        <span className="text-lg font-bold text-foreground">{c.brandName}</span>
      </Link>
    </div>
  );
}
