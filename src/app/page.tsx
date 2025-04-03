import TransactionList from "@/components/transaction-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-6">A Cuanto?</h1>
      </header>

      <TransactionList />
    </main>
  );
}
