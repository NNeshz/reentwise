"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

export function AuthGoogleButton({ disabled, onClick }: Props) {
  return (
    <Button
      variant="outline"
      type="button"
      className="h-12 w-full rounded-full font-medium"
      disabled={disabled}
      onClick={onClick}
    >
      <IconBrandGoogleFilled className="mr-2 h-5 w-5 text-foreground" />
      Iniciar sesión con Google
    </Button>
  );
}
