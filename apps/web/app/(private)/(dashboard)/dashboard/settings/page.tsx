import { OwnerProfileSettingsForm } from "@/modules/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">General</h1>
        <p className="text-muted-foreground text-sm">
          Preferencias de moneda, idioma y datos fiscales de tu cuenta.
        </p>
      </div>
      <OwnerProfileSettingsForm />
    </div>
  );
}