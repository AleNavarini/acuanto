import { LoadingPage } from "@/components/loading-page";
import { SalesWrapper } from "@/components/sales/sales-wrapper";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <Suspense fallback={<LoadingPage />}>
        <SalesWrapper />
      </Suspense >
    </main>
  );
}
