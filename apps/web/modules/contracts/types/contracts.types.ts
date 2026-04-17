export type ContractStatus =
  | "draft"
  | "active"
  | "renewed"
  | "terminated"
  | "expired";

export type ContractTenantSummary = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
};

export type ContractRoomSummary = {
  id: string;
  roomNumber: string;
};

export type ContractPropertySummary = {
  id: string;
  name: string;
};

export type ContractRecord = {
  id: string;
  status: ContractStatus;
  rentAmount: string;
  paymentDay: number;
  deposit: string | null;
  startsAt: string;
  endsAt: string | null;
  signedAt: string | null;
  terminatedAt: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ContractListRow = {
  contract: ContractRecord;
  tenant: ContractTenantSummary;
  room: ContractRoomSummary;
  property: ContractPropertySummary;
};

export type ContractsListResponse = ContractListRow[];

export type UpdateContractInput = {
  rentAmount?: string;
  paymentDay?: number;
  deposit?: string;
  endsAt?: string | null;
  notes?: string | null;
};
