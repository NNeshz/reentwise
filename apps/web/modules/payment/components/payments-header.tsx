export function PaymentsHeader() {
  return (
    <div className="flex flex-col items-start md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
      <div className="flex flex-col md:gap-1 text-left w-full md:w-auto">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus pagos de forma sencilla y eficiente.
          </p>
        </div>
    </div>
  );
}
