import { ExpensesHeader } from "@/modules/expenses/components/expenses-header";
import { ExpensesFilters } from "@/modules/expenses/components/expenses-filters";
import { ExpensesList } from "@/modules/expenses/components/expenses-list";

export default function ExpensesPage() {
  return (
    <div className="space-y-4">
      <ExpensesHeader />
      <ExpensesFilters />
      <ExpensesList />
    </div>
  );
}
