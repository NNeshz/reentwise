import { createApiClient } from "@reentwise/api/src/eden"

export type ApiClient = ReturnType<typeof createApiClient>

export const apiClient: ApiClient = createApiClient(process.env.NEXT_PUBLIC_BACKEND_URL!)
