export type SettingsNavItem = {
  label: string;
  href: string;
};

/** Subset of `user` returned by `GET /api/settings/owner/profile`. */
export type OwnerProfileSettings = {
  currency: string | null;
  timezone: string | null;
  locale: string | null;
  businessName: string | null;
  taxId: string | null;
};

export type OwnerProfilePatchInput = {
  currency?: string | null;
  timezone?: string | null;
  locale?: string | null;
  businessName?: string | null;
  taxId?: string | null;
};
