import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

/** ISO 4217 alpha code (normalized to uppercase in the service). */
const currencyValueSchema = t.String({
  minLength: 3,
  maxLength: 3,
  pattern: "^[A-Za-z]{3}$",
});

/** BCP 47-like locale tag (e.g. en, en-US, pt-BR). */
const localeValueSchema = t.String({
  minLength: 2,
  maxLength: 35,
  pattern: "^[a-zA-Z]{2,8}([_-][a-zA-Z0-9]{1,8})*$",
});

/** IANA timezone name (e.g. America/Mexico_City). */
const timezoneValueSchema = t.String({ minLength: 1, maxLength: 100 });

const optionalNullable = <T extends ReturnType<typeof t.String>>(
  inner: T,
) => t.Optional(t.Union([inner, t.Null()]));

export const ownerProfileSettingsDataSchema = t.Object({
  currency: t.Union([t.String(), t.Null()]),
  timezone: t.Union([t.String(), t.Null()]),
  locale: t.Union([t.String(), t.Null()]),
  businessName: t.Union([t.String(), t.Null()]),
  taxId: t.Union([t.String(), t.Null()]),
});

export const patchOwnerProfileBodySchema = t.Object({
  currency: optionalNullable(currencyValueSchema),
  timezone: optionalNullable(timezoneValueSchema),
  locale: optionalNullable(localeValueSchema),
  businessName: optionalNullable(t.String({ minLength: 1, maxLength: 200 })),
  taxId: optionalNullable(t.String({ minLength: 1, maxLength: 64 })),
});

export const ownerProfileGetSuccessSchema = apiSuccessEnvelopeSchema(
  ownerProfileSettingsDataSchema,
);

export const ownerProfilePatchSuccessSchema = apiSuccessEnvelopeSchema(
  ownerProfileSettingsDataSchema,
);

export const ownerProfileNotFoundSchema = apiErrorEnvelopeSchema(404);
export const ownerProfileBadRequestSchema = apiErrorEnvelopeSchema(400);
export const ownerProfileServerErrorSchema = apiErrorEnvelopeSchema(500);
