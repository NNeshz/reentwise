/** Svix signing headers Resend sends with webhook POSTs. */
export function parseSvixHeaders(request: Request): {
  id: string;
  timestamp: string;
  signature: string;
} | null {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return null;
  return { id, timestamp, signature };
}
