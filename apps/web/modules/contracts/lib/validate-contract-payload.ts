import type {
  ContractListRow,
  ContractRecord,
  ContractRoomSummary,
  ContractPropertySummary,
  ContractTenantSummary,
  ContractStatus,
  ContractsListResponse,
} from "@/modules/contracts/types/contracts.types";

function parseContractRecord(value: unknown): ContractRecord {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de contrato");
  }
  const c = value as Record<string, unknown>;
  if (typeof c.id !== "string") throw new Error("Formato inválido de contrato");
  return {
    id: c.id,
    status: (typeof c.status === "string" ? c.status : "draft") as ContractStatus,
    rentAmount: c.rentAmount != null ? String(c.rentAmount) : "0",
    paymentDay: typeof c.paymentDay === "number" ? c.paymentDay : 0,
    deposit: c.deposit != null ? String(c.deposit) : null,
    startsAt: typeof c.startsAt === "string" ? c.startsAt : "",
    endsAt: typeof c.endsAt === "string" ? c.endsAt : null,
    signedAt: typeof c.signedAt === "string" ? c.signedAt : null,
    terminatedAt: typeof c.terminatedAt === "string" ? c.terminatedAt : null,
    notes: typeof c.notes === "string" ? c.notes : null,
    createdAt: typeof c.createdAt === "string" ? c.createdAt : null,
    updatedAt: typeof c.updatedAt === "string" ? c.updatedAt : null,
  };
}

function parseContractTenant(value: unknown): ContractTenantSummary {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de inquilino en contrato");
  }
  const t = value as Record<string, unknown>;
  return {
    id: typeof t.id === "string" ? t.id : "",
    name: typeof t.name === "string" ? t.name : "",
    whatsapp: typeof t.whatsapp === "string" ? t.whatsapp : "",
    email: typeof t.email === "string" ? t.email : "",
  };
}

function parseContractRoom(value: unknown): ContractRoomSummary {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de cuarto en contrato");
  }
  const r = value as Record<string, unknown>;
  return {
    id: typeof r.id === "string" ? r.id : "",
    roomNumber: typeof r.roomNumber === "string" ? r.roomNumber : "",
  };
}

function parseContractProperty(value: unknown): ContractPropertySummary {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de propiedad en contrato");
  }
  const p = value as Record<string, unknown>;
  return {
    id: typeof p.id === "string" ? p.id : "",
    name: typeof p.name === "string" ? p.name : "",
  };
}

function parseContractListRow(value: unknown): ContractListRow {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de fila de contrato");
  }
  const o = value as Record<string, unknown>;
  return {
    contract: parseContractRecord(o.contract),
    tenant: parseContractTenant(o.tenant),
    room: parseContractRoom(o.room),
    property: parseContractProperty(o.property),
  };
}

export function parseContractsListResponse(data: unknown): ContractsListResponse {
  if (!Array.isArray(data)) throw new Error("Respuesta inválida de contratos");
  return data.map(parseContractListRow);
}
