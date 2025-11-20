import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommendation",
};

export default function RecommendationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
