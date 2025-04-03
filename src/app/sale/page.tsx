import { AddSaleForm } from "@/components/add-sale-form";

export default function AddSalePage() {
    return (
        <main className="container mx-auto px-4 py-6 bg-red ">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                <AddSaleForm />
            </div>
        </main>
    )
}