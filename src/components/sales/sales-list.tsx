"use client";

import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CarSaleWithModel } from "@/types/car-sale-with-model";
import SaleCard from "../sale-card";



export default function SalesList({ initialSales }: { initialSales: CarSaleWithModel[] }) {

    const [sortBy, setSortBy] = useState("date");
    const [sales, setSales] = useState<CarSaleWithModel[]>(initialSales);

    // Sort sales based on selected option
    const sortedSales = [...sales].sort((a, b) => {
        if (sortBy === "price-asc") return a.priceUsd - b.priceUsd;
        if (sortBy === "price-desc") return b.priceUsd - a.priceUsd;
        if (sortBy === "date")
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "year-desc") return b.carYear - a.carYear;
        if (sortBy === "year-asc") return a.carYear - b.carYear;
        return 0;
    });

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