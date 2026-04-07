import { useQuery } from "@tanstack/react-query";
import { tenantsService } from "@/modules/tenants/service/tenants-service";

const QUERY_KEY = ["tenants", "audits-filter"] as const;

export function useAuditFilterTenants() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => tenantsService.getTenants({ page: 1 }),
    staleTime: 1000 * 60 * 5,
  });
}
