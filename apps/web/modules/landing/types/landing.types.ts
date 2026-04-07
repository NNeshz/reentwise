export type LandingNavLink = {
  name: string;
  href: string;
};

export type LandingCta = {
  label: string;
  href: string;
};

export type LandingStatItem = {
  value: string;
  caption: string;
};

export type LandingFaqApproach = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export type LandingFooterLink = {
  label: string;
  href: string;
};

export type LandingFooterColumn = {
  heading: string;
  links: LandingFooterLink[];
};
