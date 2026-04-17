export type ExpenseCategory =
  | "maintenance"
  | "repair"
  | "tax"
  | "insurance"
  | "utility"
  | "administration"
  | "other";

export type ExpenseListRow = {
  expense: {
    id: string;
    ownerId: string;
    propertyId: string | null;
    roomId: string | null;
    category: ExpenseCategory;
    amount: string;
    description: string | null;
    vendor: string | null;
    receiptUrl: string | null;
    incurredAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  property: {
    id: string;
    name: string;
  } | null;
  room: {
    id: string;
    roomNumber: string;
  } | null;
};

export type CreateExpenseInput = {
  propertyId?: string;
  roomId?: string;
  category: ExpenseCategory;
  amount: string;
  description?: string;
  vendor?: string;
  receiptUrl?: string;
  incurredAt?: string;
};

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type ExpensesListPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type ExpensesListResponse = {
  expenses: ExpenseListRow[];
  pagination: ExpensesListPagination;
};
