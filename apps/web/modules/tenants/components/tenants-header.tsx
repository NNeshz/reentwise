export function TenantsHeader() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:space-y-0">
      <div className="flex w-full flex-col text-left md:w-auto md:gap-1">
        <h1 className="text-2xl font-bold">Inquilinos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus inquilinos de forma sencilla y eficiente.
        </p>
      </div>
    </div>
  );
}
