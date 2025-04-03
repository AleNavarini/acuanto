"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Combobox } from "./ui/combobox";
import { carBrands } from "@/data/carBrands";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";


// Car model schema
const carModelSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    version: z.string().optional(),
});

interface CarModel {
    id: number;
    make: string;
    model: string;
    version: string;
}

// Map carBrands to the Combobox format
const brandOptions = carBrands.map(brand => ({
    label: brand.label,
    value: brand.value,
}));

export function ModelForm() {
    const [brandModels, setBrandModels] = useState<CarModel[]>([]);
    const [modelOptions, setModelOptions] = useState<{ label: string; value: string }[]>([]);
    const [versionOptions, setVersionOptions] = useState<{ label: string; value: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const modelForm = useForm<z.infer<typeof carModelSchema>>({
        resolver: zodResolver(carModelSchema),
        defaultValues: {
            brand: "",
            model: "",
            version: "",
        },
    });

    // Watch for changes
    const selectedBrand = modelForm.watch("brand");
    const selectedModel = modelForm.watch("model");

    // Fetch models for the selected brand
    useEffect(() => {
        if (!selectedBrand) {
            setBrandModels([]);
            setModelOptions([]);
            setVersionOptions([]);
            modelForm.setValue("model", "");
            modelForm.setValue("version", "");
            return;
        }

        const fetchModelsByBrand = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/cars/models?brand=${encodeURIComponent(selectedBrand)}`);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setBrandModels(data.models);

                // Extract unique model strings
                const uniqueModels = data.models.length > 0
                    ? [...new Set(data.models.map((m: CarModel) => m.model))]
                    : [];
                setModelOptions(uniqueModels.map((model: any) => ({
                    label: model,
                    value: model,
                })));

                setVersionOptions([]);
                modelForm.setValue("model", "");
                modelForm.setValue("version", "");
            } catch (error) {
                console.error("Error fetching models for brand:", error);
                setBrandModels([]);
                setModelOptions([]);
                setVersionOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModelsByBrand();
    }, [selectedBrand]);

    // Filter versions in-memory based on selected model
    useEffect(() => {
        if (!selectedBrand || !selectedModel) {
            setVersionOptions([]);
            modelForm.setValue("version", "");
            return;
        }

        const modelVersions = brandModels
            .filter(m => m.model === selectedModel)
            .map(m => m.version);

        const uniqueVersions = [...new Set(modelVersions)];

        setVersionOptions(uniqueVersions.map(version => ({
            label: version,
            value: version,
        })));
        modelForm.setValue("version", "");
    }, [selectedModel, brandModels]);

    // Handle form submission to create a new model if it doesn't exist
    const onSubmit = async (data: z.infer<typeof carModelSchema>) => {
        const modelExists = brandModels.some(m => m.model === data.model) && versionOptions.some(v => v.value == data.version);
        console.log('Model exists', modelExists, data)
        if (!modelExists) {
            try {
                const response = await fetch("/api/cars/models", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        make: data.brand,
                        model: data.model,
                        version: data.version || "", // Default to empty string if no version
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create model");
                }

                const newModel = await response.json();
                setBrandModels(prev => [...prev, newModel]);
                setModelOptions(prev => [...prev, { label: data.model, value: data.model }]);
            } catch (error) {
                console.error("Error creating new model:", error);
                return;
            }
        }
    };

    return (
        <Form {...modelForm}>
            <form onSubmit={modelForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={modelForm.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marca del auto</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={brandOptions}
                                    placeholder="Elija una marca"
                                    selectedValue={field.value}
                                    onChange={(value) => field.onChange(value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedBrand && (
                    isLoading ? (
                        <div className="mt-4 flex justify-center items-center">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                            <span className="ml-2">Cargando modelos...</span>
                        </div>
                    ) : (
                        <>
                            <FormField
                                control={modelForm.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Modelo</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                items={modelOptions}
                                                placeholder="Elija un modelo o escriba uno nuevo"
                                                selectedValue={field.value}
                                                onChange={(value) => {
                                                    console.log(`Value is ${value}`)
                                                    field.onChange(value)
                                                }}
                                                allowCustomInput // Enable custom input
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedModel && (
                                <FormField
                                    control={modelForm.control}
                                    name="version"
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Versión</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    items={versionOptions}
                                                    placeholder="Elija una versión o escriba una nueva"
                                                    selectedValue={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    allowCustomInput // Enable custom input for versions too
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <Button type="submit" className="cursor-pointer">Buscar / Crear modelo</Button>
                        </>
                    )
                )}
            </form>
        </Form>
    );
}