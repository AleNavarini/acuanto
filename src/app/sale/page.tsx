import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SaleForm } from "@/components/sale-form";
import { Suspense } from "react";
import { LoadingPage } from "@/components/loading-page";

export default function AddSalePage() {
    return (
        <main className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="w-full flex justify-between">
                    <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                    <Button variant={"outline"} className="cursor-pointer" >
                        <Link href="/model" >
                            Agregar modelo
                        </Link>
                    </Button>
                </div>
            </div>
            <Suspense fallback={<LoadingPage />}>
                <SaleForm />
            </Suspense>
        </main>
    );
}