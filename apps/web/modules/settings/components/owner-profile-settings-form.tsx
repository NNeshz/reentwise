"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@reentwise/ui/src/components/form";
import { OwnerProfileFormActions } from "@/modules/settings/components/owner-profile-form-actions";
import { OwnerProfileFormError } from "@/modules/settings/components/owner-profile-form-error";
import { OwnerProfileFormSkeleton } from "@/modules/settings/components/owner-profile-form-skeleton";
import { OwnerProfileTextField } from "@/modules/settings/components/owner-profile-text-field";
import { ProfileSelectField } from "@/modules/settings/components/profile-select-field";
import {
  useOwnerProfile,
  useUpdateOwnerProfile,
} from "@/modules/settings/hooks/use-owner-profile";
import { useProfileSelectOptions } from "@/modules/settings/hooks/use-profile-select-options";
import {
  buildOwnerProfilePatch,
  ownerProfileFormSchema,
  ownerProfileValuesFromServer,
} from "@/modules/settings/lib/owner-profile-form-model";
import type { OwnerProfileFormValues } from "@/modules/settings/lib/owner-profile-form-model";
import type { OwnerProfileSettings } from "@/modules/settings/types/settings.types";
import { cn } from "@reentwise/ui/src/lib/utils";

/**
 * Mounts only when profile `data` exists so `useForm` gets real DB defaults on first paint.
 * Radix Select + RHF often miss the first `reset()` in an effect when the form was created while `data` was still loading.
 */
function OwnerProfileSettingsFormBody({
  className,
  data,
  dataUpdatedAt,
}: {
  className?: string | undefined;
  data: OwnerProfileSettings;
  dataUpdatedAt: number;
}) {
  const updateProfile = useUpdateOwnerProfile();
  const { currencyOptions, localeOptions, timeZoneOptions } =
    useProfileSelectOptions(data);

  const serverRef = React.useRef(data);
  const form = useForm<OwnerProfileFormValues>({
    resolver: zodResolver(ownerProfileFormSchema),
    defaultValues: ownerProfileValuesFromServer(data),
  });

  const { reset } = form;

  React.useEffect(() => {
    serverRef.current = data;
    reset(ownerProfileValuesFromServer(data));
  }, [data, dataUpdatedAt, reset]);

  const onSubmit = async (values: OwnerProfileFormValues) => {
    const base = serverRef.current;
    if (!base) return;

    const patch = buildOwnerProfilePatch(base, values);
    if (Object.keys(patch).length === 0) {
      return;
    }

    const next = await updateProfile.mutateAsync(patch);
    serverRef.current = next;
    reset(ownerProfileValuesFromServer(next));
  };

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
            <ProfileSelectField
              control={form.control}
              name="currency"
              label="Moneda"
              placeholder="Elige moneda"
              defaultOptionLabel="Predeterminado del producto"
              options={currencyOptions}
            />
            <ProfileSelectField
              control={form.control}
              name="locale"
              label="Idioma"
              placeholder="Elige idioma"
              defaultOptionLabel="Predeterminado"
              options={localeOptions}
            />
            <ProfileSelectField
              control={form.control}
              name="timezone"
              label="Zona horaria"
              placeholder="Elige zona horaria"
              defaultOptionLabel="Predeterminado"
              options={timeZoneOptions}
              contentClassName="max-h-[min(24rem,70vh)]"
            />
          </div>

          <div className="flex flex-col gap-6">
            <OwnerProfileTextField
              control={form.control}
              name="businessName"
              label="Razón social o nombre comercial"
              placeholder="Mi arrendadora S.A."
              autoComplete="organization"
            />
            <OwnerProfileTextField
              control={form.control}
              name="taxId"
              label="RFC / identificador fiscal"
              placeholder="XAXX010101000"
              autoComplete="off"
            />
          </div>

          <OwnerProfileFormActions
            isSaving={updateProfile.isPending}
            isDirty={form.formState.isDirty}
            onDiscard={() => {
              if (serverRef.current) {
                reset(ownerProfileValuesFromServer(serverRef.current));
              }
            }}
          />
        </form>
      </Form>
    </div>
  );
}

export function OwnerProfileSettingsForm({ className }: { className?: string }) {
  const { data, dataUpdatedAt, isPending, isError, error, refetch } =
    useOwnerProfile();

  if (isPending) {
    return <OwnerProfileFormSkeleton className={className} />;
  }

  if (isError) {
    return (
      <OwnerProfileFormError
        error={error}
        onRetry={() => void refetch()}
        className={className}
      />
    );
  }

  return (
    <OwnerProfileSettingsFormBody
      className={className}
      data={data}
      dataUpdatedAt={dataUpdatedAt}
    />
  );
}
