"use client";

import {
  landingStadisticsContent,
  landingStadisticsStats,
} from "@/modules/landing/data";
import { LANDING_CONTAINER, LANDING_SECTION } from "@/modules/landing/lib/landing-display";
import { LandingStadisticsBadge } from "./landing-stadistics-badge";
import { LandingStadisticsCopy } from "./landing-stadistics-copy";
import { LandingStadisticsActions } from "./landing-stadistics-actions";
import { LandingStadisticsImage } from "./landing-stadistics-image";
import { LandingStadisticsStatCard } from "./landing-stadistics-stat-card";

export function Stadistics() {
  const c = landingStadisticsContent;

  return (
    <section
      className={`${LANDING_SECTION} flex flex-col items-center justify-center`}
    >
      <div className={`${LANDING_CONTAINER} space-y-12`}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex max-w-xl flex-col items-start space-y-6 text-left">
            <LandingStadisticsBadge label={c.badgeLabel} />
            <LandingStadisticsCopy title={c.title} body={c.body} />
            <LandingStadisticsActions
              primaryCta={c.primaryCta}
              secondaryCta={c.secondaryCta}
            />
          </div>
          <LandingStadisticsImage src={c.imageSrc} alt={c.imageAlt} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {landingStadisticsStats.map((item, index) => (
            <LandingStadisticsStatCard key={item.caption} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
