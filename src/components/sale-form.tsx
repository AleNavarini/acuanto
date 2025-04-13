"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carBrands as carMakes } from "@/data/carBrands";
import { provinces } from "@/data/provinces";
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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Constants
const API_MODELS_URL = "/api/cars/models";

// Types
type ComboboxItem = { label: string; value: string };

// Schema
const saleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    version: z.string().optional(),
    priceUsd: z.number(),
    priceArs: z.number(),
    saleDate: z.date(),
    location: z.string(),
    status: z.string(),
    notes: z.string().optional()
});

// Pre-mapped car makes for Combobox
const makeOptions: ComboboxItem[] = carMakes.map((brand) => ({
    label: brand.label,
    value: brand.value,
}));

const provinceOptions: ComboboxItem[] = provinces.map((province) => ({
    label: province.label,
    value: province.value,
}));

const statusOptions = [
    { label: "Muy mal", value: "very_bad" },
    { label: "Mal", value: "bad" },
    { label: "Promedio", value: "average" },
    { label: "Bueno", value: "good" },
    { label: "Muy bueno", value: "very_good" },
];

// Custom hook for fetching models and versions
function useCarData(make: string, model: string) {
    const [models, setModels] = useState<ComboboxItem[]>([]);
    const [versions, setVersions] = useState<ComboboxItem[]>([]);
    const [isModelsLoading, setIsModelsLoading] = useState(false);
    const [isVersionsLoading, setIsVersionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchModels = async (make: string) => {
        setIsModelsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_MODELS_URL}?make=${make}`);
            if (!response.ok) throw new Error("Failed to fetch models");
            const data = await response.json();
            const uniqueModels = [
                ...new Set<string>(data.models.map((m: { model: string }) => m.model)),
            ].map((model) => ({ label: model, value: model }));
            console.log(uniqueModels)
            setModels(uniqueModels);
        } catch (err) {
            setError("Failed to load models. Please try again.");
            console.error(err);
        } finally {
            setIsModelsLoading(false);
        }
    };

    const fetchVersions = async (make: string, model: string) => {
        setIsVersionsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_MODELS_URL}?make=${make}`);
            if (!response.ok) throw new Error("Failed to fetch versions");
            const data = await response.json();
            const versions = data.models
                .filter((m: { model: string }) => m.model === model)
                .map((m: { version: string }) => ({
                    label: m.version,
                    value: m.version,
                }));
            setVersions(versions);
        } catch (err) {
            setError("Failed to load versions. Please try again.");
            console.error(err);
        } finally {
            setIsVersionsLoading(false);
        }
    };

    useEffect(() => {
        if (make) fetchModels(make);
        else setModels([]);
    }, [make]);

    useEffect(() => {
        if (make && model) fetchVersions(make, model);
        else setVersions([]);
    }, [make, model]);

    return { models, versions, isModelsLoading, isVersionsLoading, error };
}

export function SaleForm() {
    const router = useRouter();
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { models, versions, isModelsLoading, isVersionsLoading, error } =
        useCarData(make, model);

    const form = useForm<z.infer<typeof saleSchema>>({
        resolver: zodResolver(saleSchema),
        defaultValues: { make: "", model: "", version: "" },
    });



    // Clear dependent fields when make or model changes
    useEffect(() => {
        if (make) {
            form.setValue("model", "");
            form.setValue("version", "");
            setModel("");
        }
    }, [make]);

    useEffect(() => {
        if (model) {
            form.setValue("version", "");
        }
    }, [model]);


    const onSubmit = async (data: z.infer<typeof saleSchema>) => {
        setIsSubmitting(true);
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
            if (!response.ok) throw new Error("Failed to create sale");
            router.push("/");
        } catch {
            form.setError("root", { message: "Failed to submit. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-1/2 mx-auto" >
                {error && <ErrorAlert message={error} />}
                {form.formState.errors.root && (
                    <ErrorAlert message={form.formState.errors.root.message} />
                )}

                {/* Make Field */}
                <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Car Make</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={makeOptions}
                                    placeholder="Select a make"
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

                {/* Model Field */}
                {isModelsLoading ? (
                    <LoadingIndicator message="Loading models..." />
                ) : models.length === 0 ? (
                    make ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No Models</AlertTitle>
                            <AlertDescription>
                                No models found for this make. Please add a model.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <p className="text-muted-foreground">Select a make to load models.</p>
                    )
                ) : (
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Combobox
                                        items={models}
                                        placeholder="Select a model"
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

                {/* Version Field */}
                {isVersionsLoading ? (
                    <LoadingIndicator message="Loading versions..." />
                ) : versions.length > 0 && (
                    <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version - Si tu version no esta aqui por favor cargar el modelo en el boton Agregar Modelo</FormLabel>
                                <FormControl>
                                    <Combobox
                                        items={versions}
                                        placeholder="Select a version"
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {make && model && (
                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="priceUsd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio en dolares</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Precio en dolares" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priceArs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio en Pesos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Precio en pesos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicacion de la venta</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            items={provinceOptions}
                                            placeholder="Select a province"
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Status Field */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="self-start">
                                    <FormLabel>Estado del vehículo</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="saleDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel >Fecha de la venta</FormLabel>
                                    <Popover >
                                        <PopoverTrigger asChild >
                                            <FormControl >
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}

                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                }}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Notes Field */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Notas adicionales</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese cualquier información adicional relevante sobre la venta"
                                            className="min-h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="col-span-2" >
                            Crear Venta
                        </Button>
                    </div>
                )}
                <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
            </form>
        </Form>
    );
}

// Reusable UI Components
function ErrorAlert({ message }: { message?: string }) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}

function LoadingIndicator({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>{message}</p>
        </div>
    );
}