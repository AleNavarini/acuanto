import { AddSaleForm } from "@/components/add-sale-form";
import { promises as fs } from 'fs';
import path from 'path';
import { JSX } from "react";

interface Locality {
    code: string;
    name: string;
}


export default function AddSalePage(): JSX.Element {
    return (
        <main className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                <AddSaleForm />
            </div>
        </main>
    );
}