import { useQuery } from "@tanstack/react-query";
import { auditsService } from "@/modules/audits/service/audits-service";
import { useAuditsFilters } from "@/modules/audits/store/use-audits-filters";

const AUDITS_KEY = ["audits"] as const;

export function useAuditsQuery() {
  const { page, limit, tenantId, channel, status } = useAuditsFilters();

  return useQuery({
    queryKey: [...AUDITS_KEY, { page, limit, tenantId, channel, status }],
    queryFn: () =>
      auditsService.getAudits({
        page,
        limit,
        tenantId,
        channel,
        status,
      }),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}
