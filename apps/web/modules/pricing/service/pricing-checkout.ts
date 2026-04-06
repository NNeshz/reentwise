/**
 * Crea una Checkout Session en el backend y redirige al hosted checkout de Stripe.
 */
export async function startStripeCheckout(priceId: string): Promise<void> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!.replace(/\/$/, "");
  const res = await fetch(`${backend}/api/stripe/crear-suscripcion`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  if (res.status === 401) {
    window.location.href = `/auth?next=${encodeURIComponent("/pricing")}`;
    return;
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  if (!res.ok) {
    const body = json as { message?: string };
    throw new Error(
      body?.message || "Error al crear la sesión de Stripe",
    );
  }

  const envelope = json as { data?: { url?: string } };
  const url = envelope.data?.url;
  if (!url) {
    throw new Error("No se recibió URL de Stripe");
  }

  window.location.href = url;
}
