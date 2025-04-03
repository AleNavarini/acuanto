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
    version: z.string().nonempty().optional(),
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
    const [modelIsLoading, setModelIsLoading] = useState(false);

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
                const uniqueModels: string[] = [...new Set(data.models.map((m: CarModel) => m.model))] as string[]

                const uniques = uniqueModels.map((model: string) => ({
                    label: model,
                    value: model,
                }))
                setModelOptions(uniques);

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
    }, [selectedBrand, modelForm]);

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
    }, [selectedModel, brandModels, modelForm, selectedBrand]);

    // Handle form submission to create a new model if it doesn't exist
    const onSubmit = async (data: z.infer<typeof carModelSchema>) => {
        const modelExists = brandModels.some(m =>
            m.model === data.model &&
            (!data.version || m.version === data.version)
        );

        if (!modelExists) {
            try {
                setModelIsLoading(true);
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
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create model");
                }

                const responseData = await response.json();
                const newModel = responseData.newModel; // Match your API response structure

                setBrandModels(prev => [...prev, newModel]);
                setModelOptions(prev => {
                    const exists = prev.some(opt => opt.value === newModel.model);
                    if (exists) return prev;
                    return [...prev, { label: newModel.model, value: newModel.model }];
                });

                if (newModel.version) {
                    setVersionOptions(prev => {
                        const exists = prev.some(opt => opt.value === newModel.version);
                        if (exists) return prev;
                        return [...prev, { label: newModel.version, value: newModel.version }];
                    });
                }

                // Explicitly set form values to persist the selection
                modelForm.setValue("brand", newModel.make, { shouldValidate: true });
                modelForm.setValue("model", newModel.model, { shouldValidate: true });
                modelForm.setValue("version", newModel.version || "", { shouldValidate: true });

                console.log('Form values after set:', modelForm.getValues());

            } catch (error) {
                console.error("Error creating new model:", error);
                // Optionally show an error message to the user here
            } finally {
                setModelIsLoading(false);
            }
        } else {
            // If model exists, just set the form values
            modelForm.setValue("model", data.model);
            modelForm.setValue("version", data.version || "");
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
                                    render={({ field }) => {
                                        console.log('Version field value:', field.value);
                                        console.log('Version options:', versionOptions);
                                        return (
                                            <FormItem className="mt-4">
                                                <FormLabel>Versión</FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        items={versionOptions}
                                                        placeholder="Elija una versión o escriba una nueva"
                                                        selectedValue={field.value || ''} // Ensure no undefined
                                                        onChange={(value) => {
                                                            console.log('Version changed to:', value);
                                                            field.onChange(value);
                                                        }}
                                                        allowCustomInput
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            )}
                            <Button type="submit" className="cursor-pointer" disabled={modelIsLoading} >
                                {modelIsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Buscar / Crear modelo</span>}
                            </Button>
                        </>
                    )
                )}
            </form>
        </Form>
    );
}