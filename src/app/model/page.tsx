import { ModelForm } from "@/components/model-form";

export default function CreateModelPage() {
    return (
        <main className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                <ModelForm />
            </div>
        </main>
    )
}