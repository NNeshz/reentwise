import { AuthSection } from "@/modules/auth";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthSection callbackNext={next} />;
}
