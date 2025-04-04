"use client"

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carBrands as carMakes } from "@/data/carBrands";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Combobox } from "./ui/combobox";
import { CarModel } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react"; // Add this import for the loading spinner

// Map carBrands to the Autocomplete format
const makeOptions = carMakes.map((brand) => ({
    label: brand.label,
    value: brand.value,
}));

const saleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    version: z.string().nonempty().optional(),
    priceArs: z.number(),
    priceUsd: z.number(),
    year: z.number(),
    saleDate: z.date(),
    location: z.string(),
    status: z.string(),
    notes: z.string().optional()
});

export function SaleForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModelsLoading, setIsModelsLoading] = useState(false);
    const [isVersionsLoading, setIsVersionsLoading] = useState(false);
    const [make, setMake] = useState('');
    const [makeModels, setMakeModels] = useState<{ label: string, value: string }[]>([]);
    const [model, setModel] = useState('');
    const [modelVersions, setModelVersions] = useState<{ label: string, value: string }[]>([]);

    const saleForm = useForm<z.infer<typeof saleSchema>>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            make: "",
            model: "",
            version: "",
        },
    });

    // Effect for fetching models
    useEffect(() => {
        const fetchModels = async () => {
            if (!make) {
                setMakeModels([]);
                return;
            }

            setIsModelsLoading(true);
            try {
                const response = await fetch(`/api/cars/models?make=${make}`);
                if (!response.ok) throw new Error("Failed to fetch models");
                const data = await response.json();
                const uniqueModels = [...new Set<string>(data.models.map((model: CarModel) => model.model))]
                    .map((model: string) => ({
                        label: model,
                        value: model
                    }));

                setMakeModels(uniqueModels);
            } catch (error) {
                console.error("Error fetching models:", error);
            } finally {
                setIsModelsLoading(false);
            }
        };

        fetchModels();
    }, [make]);

    // Effect for fetching versions
    useEffect(() => {
        const fetchVersions = async () => {
            if (!make || !model) {
                setModelVersions([]);
                return;
            }

            setIsVersionsLoading(true);
            try {
                const response = await fetch(`/api/cars/models?make=${make}`);
                if (!response.ok) throw new Error("Failed to fetch models");
                const data = await response.json();
                const responseModels: CarModel[] = data.models;
                const models = responseModels.filter((mod) => mod.model === model);
                const formattedVersions = models.map((model) => ({
                    label: model.version,
                    value: model.version
                }));
                setModelVersions(formattedVersions);
            } catch (error) {
                console.error("Error fetching model versions:", error);
            } finally {
                setIsVersionsLoading(false);
            }
        };

        fetchVersions();
    }, [model]);

    // Effect for clearing dependent values
    useEffect(() => {
        if (make) {
            saleForm.setValue('model', '');
            saleForm.setValue('version', '');
            setModel('');
            setModelVersions([]);
        }

        if (model) {
            saleForm.setValue('version', '');
        }
    }, [make, model, saleForm]);

    const onSubmit = async (data: z.infer<typeof saleSchema>) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/cars/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    make: data.make,
                    model: data.model,
                    version: data.version || "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create model");
            }
            router.push("/");

        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...saleForm}>
            <form onSubmit={saleForm.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-3">
                    <FormField
                        control={saleForm.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca del auto</FormLabel>
                                <FormControl>
                                    <Combobox
                                        key={`${field}`}
                                        items={makeOptions}
                                        placeholder="Elija una marca"
                                        onValueChange={(value) => {
                                            setMake(value);
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isModelsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p>Cargando modelos...</p>
                        </div>
                    ) : makeModels.length === 0 ? (
                        make ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Este auto no tiene modelos por favor agregue su modelo
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <p className="text-muted-foreground">Please select a make to load models.</p>
                        )
                    ) : (
                        <FormField
                            control={saleForm.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modelo</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            key={make}
                                            items={makeModels}
                                            placeholder="Elija un modelo"
                                            onValueChange={(value) => {
                                                setModel(value);
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {isVersionsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p>Cargando versiones...</p>
                        </div>
                    ) : modelVersions.length > 0 && (
                        <FormField
                            control={saleForm.control}
                            name="version"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Versión</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            key={model}
                                            items={modelVersions}
                                            placeholder="Elija una versión"
                                            onValueChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            </form>
        </Form>
    );
}