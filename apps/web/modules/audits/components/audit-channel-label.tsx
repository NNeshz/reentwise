import {
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";
import type { AuditChannel } from "@/modules/audits/types/audits.types";

type Props = {
  channel: AuditChannel;
};

export function AuditChannelLabel({ channel }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {channel === "whatsapp" ? (
        <IconBrandWhatsapp className="size-4 shrink-0" aria-hidden />
      ) : (
        <IconMail className="size-4 shrink-0" aria-hidden />
      )}
      <span className="capitalize">{channel}</span>
    </span>
  );
}
