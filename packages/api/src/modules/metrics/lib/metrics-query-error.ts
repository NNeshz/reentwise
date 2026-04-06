export class MetricsQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetricsQueryError";
  }
}
