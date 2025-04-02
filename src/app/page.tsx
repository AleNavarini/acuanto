import TransactionList from "@/components/transaction-list";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-6">A Cuanto?</h1>
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por marca, modelo..."
              className="pl-8 w-full"
            />
          </div>
          <Button>Buscar</Button>
        </div>
      </header>

      <TransactionList />
    </main>
  );
}
