import { AuthSection } from "@/modules/auth/components/auth-section";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthSection callbackNext={next} />;
}
