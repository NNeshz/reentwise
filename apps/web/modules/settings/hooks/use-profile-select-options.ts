import * as React from "react";
import type { OwnerProfileSettings } from "@/modules/settings/types/settings.types";
import {
  PROFILE_CURRENCY_OPTIONS,
  PROFILE_LOCALE_OPTIONS,
  PROFILE_TIMEZONE_OPTIONS,
  mergeSelectOptions,
} from "@/modules/settings/constants";

/**
 * Builds select option lists for owner profile, merging any saved value not in static lists.
 */
export function useProfileSelectOptions(
  data: OwnerProfileSettings | undefined,
) {
  const currencyOptions = React.useMemo(
    () =>
      mergeSelectOptions(
        PROFILE_CURRENCY_OPTIONS,
        data?.currency,
        (v) => `${v} (guardado)`,
      ),
    [data?.currency],
  );

  const localeOptions = React.useMemo(
    () =>
      mergeSelectOptions(
        PROFILE_LOCALE_OPTIONS,
        data?.locale,
        (v) => `${v} (guardado)`,
      ),
    [data?.locale],
  );

  const timeZoneOptions = React.useMemo(
    () => mergeSelectOptions(PROFILE_TIMEZONE_OPTIONS, data?.timezone),
    [data?.timezone],
  );

  return { currencyOptions, localeOptions, timeZoneOptions };
}
