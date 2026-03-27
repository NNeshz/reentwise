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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al crear la sesión de Stripe");
  }

  const data = (await res.json()) as { url?: string };
  if (!data?.url) {
    throw new Error("No se recibió URL de Stripe");
  }

  window.location.href = data.url;
}
