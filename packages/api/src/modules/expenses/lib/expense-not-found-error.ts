export class ExpenseNotFoundError extends Error {
  constructor(message = "Gasto no encontrado") {
    super(message);
    this.name = "ExpenseNotFoundError";
  }
}
