"use client";

import { useState, useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CarSaleWithModel } from "@/types/car-sale-with-model";
import SaleCard from "../sale-card";

export default function SalesList({ initialSales }: { initialSales: CarSaleWithModel[] }) {
    const [sortBy, setSortBy] = useState("date");
    const [sales] = useState<CarSaleWithModel[]>(initialSales);
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique brands from sales
    const uniqueBrands = useMemo(() => {
        const brands = new Set(sales.map(sale => sale.carModel.make));
        return Array.from(brands).sort();
    }, [sales]);

    // Filter and sort sales based on selected options
    const filteredAndSortedSales = useMemo(() => {
        return [...sales]
            .filter(sale => {
                const matchesBrand = selectedBrand === "all" || sale.carModel.make === selectedBrand;
                const matchesSearch = !searchQuery ||
                    sale.carModel.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sale.carModel.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sale.carModel.version?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesBrand && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.priceUsd - b.priceUsd;
                if (sortBy === "price-desc") return b.priceUsd - a.priceUsd;
                if (sortBy === "date")
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortBy === "year-desc") return b.carYear - a.carYear;
                if (sortBy === "year-asc") return a.carYear - b.carYear;
                return 0;
            });
    }, [sales, selectedBrand, searchQuery, sortBy]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
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

                <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filtrar por marca" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las marcas</SelectItem>
                            {uniqueBrands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        placeholder="Buscar por marca, modelo o versión..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedSales.map((sale) => (
                    <SaleCard key={sale.id} sale={sale} />
                ))}
            </div>
        </div>
    );
}