import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  ContractsListResponse,
  UpdateContractInput,
  MarkDepositCollectedInput,
} from "@/modules/contracts/types/contracts.types";
import { parseContractsListResponse } from "@/modules/contracts/lib/validate-contract-payload";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

type ContractByIdEndpoint = (params: { contractId: string }) => {
  patch: (
    body: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
  post: (
    body?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
};

class ContractsService {
  async getContracts(params: { search?: string; page?: number } = {}): Promise<ContractsListResponse> {
    const ownerClient = apiClient.contracts.owner as unknown as {
      get: (opts?: {
        query?: Record<string, unknown>;
      }) => Promise<{ data: unknown; error: { value: unknown } | null }>;
    };
    const query: Record<string, unknown> = {};
    if (params.search?.trim()) query.search = params.search.trim();
    if (params.page && params.page > 1) query.page = params.page;

    const response = await ownerClient.get({ query });

    if (response.error) {
      throw toServiceError(response.error.value, "No se pudieron cargar los contratos");
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseContractsListResponse(unwrapped);
  }

  async updateContract(contractId: string, data: UpdateContractInput): Promise<unknown> {
    const byId = apiClient.contracts.owner as unknown as ContractByIdEndpoint;
    const response = await byId({ contractId }).patch(data as Record<string, unknown>);

    if (response.error) {
      throw toServiceError(response.error.value, "No se pudo actualizar el contrato");
    }

    return unwrapEnvelopeData(response.data);
  }

  async activateContract(contractId: string): Promise<unknown> {
    const ownerClient = apiClient.contracts.owner as unknown as Record<
      string,
      ContractByIdEndpoint
    >;
    const activate = ownerClient["activate"];
    if (!activate) throw new Error("Ruta de activación no disponible");
    const response = await activate({ contractId }).post();

    if (response.error) {
      throw toServiceError(response.error.value, "No se pudo activar el contrato");
    }

    return unwrapEnvelopeData(response.data);
  }

  async terminateContract(contractId: string): Promise<unknown> {
    const ownerClient = apiClient.contracts.owner as unknown as Record<
      string,
      ContractByIdEndpoint
    >;
    const terminate = ownerClient["terminate"];
    if (!terminate) throw new Error("Ruta de terminación no disponible");
    const response = await terminate({ contractId }).post();

    if (response.error) {
      throw toServiceError(response.error.value, "No se pudo terminar el contrato");
    }

    return unwrapEnvelopeData(response.data);
  }

  async markDepositCollected(contractId: string, data: MarkDepositCollectedInput): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = apiClient as any;
    const response = await client.contracts.owner[contractId].deposit.collect.post(data);
    if (response.error) {
      throw toServiceError(response.error.value, "No se pudo registrar el depósito");
    }
    return unwrapEnvelopeData(response.data);
  }
}

export const contractsService = new ContractsService();
