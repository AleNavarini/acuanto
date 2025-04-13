"use client";

import { useState, useEffect } from "react";
import SaleCard from "./sale-card"; // Keep this name or rename to SaleCard
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Sale type
interface Sale {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  date: string;
  location: string;
}

export default function SalesList() {
  const [sortBy, setSortBy] = useState("date");
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales data from API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cars/sales");
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const data: Sale[] = await response.json();
        setSales(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Sort sales based on selected option
  const sortedSales = [...sales].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "year-desc") return b.year - a.year;
    if (sortBy === "year-asc") return a.year - b.year;
    return 0;
  });

  // Loading state
  if (isLoading) {
    return <div>Loading sales...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ventas recientes</h2>
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
        {sortedSales.map((sale) => (
          <SaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  );
}