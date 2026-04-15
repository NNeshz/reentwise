"use client";

import type { Control, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@reentwise/ui/src/components/form";
import { Input } from "@reentwise/ui/src/components/input";
import type { OwnerProfileFormValues } from "@/modules/settings/lib/owner-profile-form-model";

export function OwnerProfileTextField({
  control,
  name,
  label,
  placeholder,
  autoComplete,
}: {
  control: Control<OwnerProfileFormValues>;
  name: FieldPath<OwnerProfileFormValues>;
  label: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              autoComplete={autoComplete}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
