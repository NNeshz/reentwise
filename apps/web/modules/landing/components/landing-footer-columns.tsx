import Link from "next/link";
import type { LandingFooterColumn } from "@/modules/landing/types/landing.types";

type Props = {
  addressHeading: string;
  addressLine: string;
  columns: readonly LandingFooterColumn[];
};

export function LandingFooterColumns({
  addressHeading,
  addressLine,
  columns,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
      <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          {addressHeading}
        </h4>
        <p className="max-w-md font-host-grotesk text-xl text-foreground md:text-2xl">
          {addressLine}
        </p>
      </div>

      {columns.map((col) => (
        <div key={col.heading} className="flex flex-col gap-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {col.heading}
          </h4>
          <ul className="flex flex-col gap-3">
            {col.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
