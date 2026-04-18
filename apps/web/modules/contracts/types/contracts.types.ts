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
  graceDays: number;
  depositCollectedAt: string | null;
  depositAmountCollected: string | null;
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

export type ContractsListPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type ContractsListResponse = {
  contracts: ContractListRow[];
  pagination: ContractsListPagination;
};

export type UpdateContractInput = {
  rentAmount?: string;
  paymentDay?: number;
  deposit?: string;
  graceDays?: number;
  endsAt?: string | null;
  notes?: string | null;
};

export type MarkDepositCollectedInput = {
  amountCollected: string;
  collectedAt?: string;
};
