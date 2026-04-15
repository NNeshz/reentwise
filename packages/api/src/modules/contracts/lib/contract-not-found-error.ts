export class ContractNotFoundError extends Error {
  constructor(message = "Contrato no encontrado") {
    super(message);
    this.name = "ContractNotFoundError";
  }
}
