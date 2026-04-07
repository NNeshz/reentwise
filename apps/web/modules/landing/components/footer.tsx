import { landingFooterContent } from "@/modules/landing/data";
import { LandingFooterBrand } from "./landing-footer-brand";
import { LandingFooterColumns } from "./landing-footer-columns";

export function Footer() {
  const c = landingFooterContent;

  return (
    <footer className="w-full border-t border-border/40 bg-background px-4 pb-10 pt-20 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <LandingFooterBrand />
        <LandingFooterColumns
          addressHeading={c.addressHeading}
          addressLine={c.addressLine}
          columns={c.columns}
        />
      </div>
    </footer>
  );
}
