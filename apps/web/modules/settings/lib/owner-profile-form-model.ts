import * as z from "zod";
import { PROFILE_SELECT_DEFAULT } from "@/modules/settings/constants";
import type {
  OwnerProfilePatchInput,
  OwnerProfileSettings,
} from "@/modules/settings/types/settings.types";

export const ownerProfileFormSchema = z
  .object({
    currency: z.string().max(3),
    timezone: z.string().max(100),
    locale: z.string().max(35),
    businessName: z.string().max(200),
    taxId: z.string().max(64),
  })
  .superRefine((data, ctx) => {
    const c = data.currency.trim();
    if (c !== "" && !/^[A-Za-z]{3}$/.test(c)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currency"],
        message: "Moneda no válida.",
      });
    }
    const loc = data.locale.trim();
    if (
      loc !== "" &&
      !/^[a-zA-Z]{2,8}([_-][a-zA-Z0-9]{1,8})*$/.test(loc)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["locale"],
        message: "Idioma no válido.",
      });
    }
  });

export type OwnerProfileFormValues = z.infer<typeof ownerProfileFormSchema>;

export function ownerProfileValuesFromServer(
  data: OwnerProfileSettings,
): OwnerProfileFormValues {
  return {
    currency: data.currency ?? "",
    timezone: data.timezone ?? "",
    locale: data.locale ?? "",
    businessName: data.businessName ?? "",
    taxId: data.taxId ?? "",
  };
}

export function buildOwnerProfilePatch(
  base: OwnerProfileSettings,
  values: OwnerProfileFormValues,
): OwnerProfilePatchInput {
  const patch: OwnerProfilePatchInput = {};

  const nextCurrency = values.currency.trim();
  const baseCurrency = base.currency ?? "";
  if (nextCurrency !== baseCurrency) {
    patch.currency = nextCurrency === "" ? null : nextCurrency.toUpperCase();
  }

  const nextTimezone = values.timezone.trim();
  const baseTimezone = base.timezone ?? "";
  if (nextTimezone !== baseTimezone) {
    patch.timezone = nextTimezone === "" ? null : nextTimezone;
  }

  const nextLocale = values.locale.trim();
  const baseLocale = base.locale ?? "";
  if (nextLocale !== baseLocale) {
    patch.locale = nextLocale === "" ? null : nextLocale;
  }

  const nextBusiness = values.businessName.trim();
  const baseBusiness = base.businessName ?? "";
  if (nextBusiness !== baseBusiness) {
    patch.businessName = nextBusiness === "" ? null : nextBusiness;
  }

  const nextTax = values.taxId.trim();
  const baseTax = base.taxId ?? "";
  if (nextTax !== baseTax) {
    patch.taxId = nextTax === "" ? null : nextTax;
  }

  return patch;
}

export function profileSelectControlValue(fieldValue: string) {
  return fieldValue === "" ? PROFILE_SELECT_DEFAULT : fieldValue;
}

export function profileSelectApplyChange(
  fieldOnChange: (v: string) => void,
  value: string,
) {
  fieldOnChange(value === PROFILE_SELECT_DEFAULT ? "" : value);
}
