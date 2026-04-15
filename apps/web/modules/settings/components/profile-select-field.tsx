"use client";

import type { Control, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@reentwise/ui/src/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import type { ProfileSelectOption } from "@/modules/settings/constants";
import { PROFILE_SELECT_DEFAULT } from "@/modules/settings/constants";
import type { OwnerProfileFormValues } from "@/modules/settings/lib/owner-profile-form-model";
import {
  profileSelectApplyChange,
  profileSelectControlValue,
} from "@/modules/settings/lib/owner-profile-form-model";

type ProfileSelectName = FieldPath<
  Pick<OwnerProfileFormValues, "currency" | "locale" | "timezone">
>;

export function ProfileSelectField({
  control,
  name,
  label,
  placeholder,
  defaultOptionLabel,
  options,
  contentClassName,
}: {
  control: Control<OwnerProfileFormValues>;
  name: ProfileSelectName;
  label: string;
  placeholder: string;
  defaultOptionLabel: string;
  options: ProfileSelectOption[];
  contentClassName?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={profileSelectControlValue(field.value)}
            onValueChange={(v) => profileSelectApplyChange(field.onChange, v)}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              <SelectItem value={PROFILE_SELECT_DEFAULT}>
                {defaultOptionLabel}
              </SelectItem>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
