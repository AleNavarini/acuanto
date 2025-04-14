import { LoadingPage } from "@/components/loading-page";
import { ModelForm } from "@/components/model-form";
import { Suspense } from "react";

export default function CreateModelPage() {
    return (
        <main className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Agregar venta</h1>
                <Suspense fallback={<LoadingPage />}>
                    <ModelForm />
                </Suspense>
            </div>
        </main>
    )
}