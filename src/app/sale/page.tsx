import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";
import { SaleForm } from "@/components/sale-form";

export default function AddSalePage(): JSX.Element {
    return (
        <main className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="w-full flex justify-between">
                    <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                    <Button >
                        <Link href="/model" >
                            Agregar modelo
                        </Link>
                    </Button>
                </div>
            </div>
            <SaleForm />
        </main>
    );
}