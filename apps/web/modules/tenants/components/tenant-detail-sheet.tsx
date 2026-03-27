"use client";

import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Separator } from "@reentwise/ui/src/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import {
  IconBrandWhatsapp,
  IconMail,
  IconDoor,
  IconCalendar,
} from "@tabler/icons-react";

type Tenant = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  paymentDay: number;
  roomId: string | null;
  room: { id: string; roomNumber: string } | null;
};

function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("52") ? digits : `52${digits}`}`;
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function TenantDetailSheet({
  tenant,
  open,
  onOpenChange,
}: {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!tenant) return null;

  const paymentLabel =
    tenant.paymentDay === 0 ? "Fin de mes" : `Día ${tenant.paymentDay}`;
  const waLink = formatWhatsAppLink(tenant.whatsapp);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="items-center text-center">
          <Avatar size="lg" className="h-16 w-16 border">
            <AvatarFallback className="bg-primary/10 text-lg text-primary">
              {tenant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <SheetTitle className="text-lg">{tenant.name}</SheetTitle>
          <SheetDescription>
            {tenant.room ? (
              <Badge variant="secondary" className="text-xs font-normal">
                Hab. {tenant.room.roomNumber}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs font-normal text-muted-foreground"
              >
                Sin habitación asignada
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-5 px-4">
          <DetailRow icon={IconMail} label="Correo electrónico">
            <span className="break-all">{tenant.email}</span>
          </DetailRow>

          <DetailRow icon={IconBrandWhatsapp} label="WhatsApp">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {tenant.whatsapp}
            </a>
          </DetailRow>

          {tenant.room && (
            <DetailRow icon={IconDoor} label="Habitación">
              <span>Hab. {tenant.room.roomNumber}</span>
            </DetailRow>
          )}

          <DetailRow icon={IconCalendar} label="Día de pago">
            <span>{paymentLabel}</span>
          </DetailRow>
        </div>

        <Separator />

        <div className="flex gap-2 px-4 pb-4">
          <Button variant="outline" className="flex-1" asChild>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp className="size-4" />
              Enviar mensaje
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
