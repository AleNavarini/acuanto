"use client";

import { useState } from "react";
import TransactionCard from "./sale-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data - in a real app, this would come from an API
const transactions = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    price: 12500000,
    currency: "ARS",
    date: "2023-10-15",
    location: "Buenos Aires",
  },
  {
    id: 2,
    brand: "Volkswagen",
    model: "Golf",
    year: 2020,
    price: 14800000,
    currency: "ARS",
    date: "2023-10-12",
    location: "Córdoba",
  },
  {
    id: 3,
    brand: "Ford",
    model: "Focus",
    year: 2018,
    price: 11200000,
    currency: "ARS",
    date: "2023-10-10",
    location: "Rosario",
  },
  {
    id: 4,
    brand: "Chevrolet",
    model: "Cruze",
    year: 2021,
    price: 16500000,
    currency: "ARS",
    date: "2023-10-08",
    location: "Mendoza",
  },
  {
    id: 5,
    brand: "Renault",
    model: "Sandero",
    year: 2020,
    price: 9800000,
    currency: "ARS",
    date: "2023-10-05",
    location: "Buenos Aires",
  },
];

export default function TransactionList() {
  const [sortBy, setSortBy] = useState("date");

  // Sort transactions based on selected option
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "year-desc") return b.year - a.year;
    if (sortBy === "year-asc") return a.year - b.year;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transacciones recientes</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Ordenar por:
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Más recientes</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="year-desc">Año: más nuevos</SelectItem>
              <SelectItem value="year-asc">Año: más antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
