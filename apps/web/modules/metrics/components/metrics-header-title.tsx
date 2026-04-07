"use client";

type Props = {
  userName?: string | null;
};

export function MetricsHeaderTitle({ userName }: Props) {
  return (
    <h1 className="font-host-grotesk text-6xl text-pretty">
      Hola, {userName ?? "…"}
    </h1>
  );
}
