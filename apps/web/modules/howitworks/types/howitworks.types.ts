import type { TablerIcon } from "@tabler/icons-react";

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: TablerIcon;
};

export type HowItWorksHighlight = {
  label: string;
  body: string;
};

export type HowItWorksCta = {
  label: string;
  href: string;
};

export type HowItWorksHeroContent = {
  badge: string;
  title: string;
  description: string;
  primaryCta: HowItWorksCta;
  secondaryCta: HowItWorksCta;
};

export type HowItWorksIntroContent = {
  headline: string;
  body: string;
  tags: readonly string[];
};

export type HowItWorksHighlightsContent = {
  sectionBadge: string;
  sectionLead: string;
  items: HowItWorksHighlight[];
};

export type HowItWorksChecklistBandContent = {
  image: string;
  imageCaption: string;
  heading: string;
  lines: readonly string[];
  cta: HowItWorksCta;
};

export type HowItWorksCtaStripContent = {
  title: string;
  primaryCta: HowItWorksCta;
  secondaryCta: HowItWorksCta;
};
