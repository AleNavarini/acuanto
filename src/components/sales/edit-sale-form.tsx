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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Combobox } from "../ui/combobox";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { CarSaleWithModel } from "@/types/car-sale-with-model";

// Constants
const API_MODELS_URL = "/api/cars/models";

// Types
type ComboboxItem = { label: string; value: string };

// Schema
const saleSchema = z.object({
    make: z.string().min(1, "La marca es requerida"),
    model: z.string().min(1, "El modelo es requerido"),
    version: z.string().optional(),
    carYear: z
        .number({ invalid_type_error: "El año debe ser un número" })
        .min(1900, "El año debe ser mayor o igual a 1900")
        .max(new Date().getFullYear(), "El año no puede ser futuro"),
    priceUsd: z.number({ invalid_type_error: "El precio en dólares debe ser un número" }).min(0, "El precio no puede ser negativo"),
    priceArs: z.number({ invalid_type_error: "El precio en pesos debe ser un número" }).min(0, "El precio no puede ser negativo"),
    saleDate: z.date({ invalid_type_error: "Seleccione una fecha válida" }),
    location: z.string().min(1, "La ubicación es requerida"),
    status: z.string().min(1, "El estado es requerido"),
    notes: z.string().optional(),
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
function useCarData(initialMake: string, initialModel: string) {
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
            if (!response.ok) throw new Error("Error al cargar modelos");
            const data = await response.json();
            const uniqueModels = [
                ...new Set<string>(data.models.map((m: { model: string }) => m.model)),
            ].map((model) => ({ label: model, value: model }));
            setModels(uniqueModels);
            return data.models; // Return the full data for version filtering
        } catch (err) {
            setError("No se pudieron cargar los modelos. Intente de nuevo.");
            console.error(err);
            return [];
        } finally {
            setIsModelsLoading(false);
        }
    };

    const fetchVersions = async (make: string, model: string, allModels?: any[]) => {
        setIsVersionsLoading(true);
        setError(null);
        try {
            let modelsData = allModels;
            if (!modelsData) {
                const response = await fetch(`${API_MODELS_URL}?make=${make}`);
                if (!response.ok) throw new Error("Error al cargar versiones");
                const data = await response.json();
                modelsData = data.models;
            }
            if (!modelsData) {
                throw new Error("No se pudieron cargar los datos del modelo");
            }
            const versions = modelsData
                .filter((m: { model: string }) => m.model === model)
                .map((m: { version: string }) => ({
                    label: m.version,
                    value: m.version,
                }));
            setVersions(versions);
        } catch (err) {
            setError("No se pudieron cargar las versiones. Intente de nuevo.");
            console.error(err);
        } finally {
            setIsVersionsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            if (initialMake) {
                const modelsData = await fetchModels(initialMake);
                if (initialModel && modelsData.length > 0) {
                    await fetchVersions(initialMake, initialModel, modelsData);
                }
            }
        };
        fetchInitialData();
    }, []); // Only run on mount

    // Handle make changes
    const handleMakeChange = async (make: string) => {
        await fetchModels(make);
        setVersions([]); // Clear versions when make changes
    };

    // Handle model changes
    const handleModelChange = async (make: string, model: string) => {
        await fetchVersions(make, model);
    };

    return {
        models,
        versions,
        isModelsLoading,
        isVersionsLoading,
        error,
        handleMakeChange,
        handleModelChange
    };
}

export function EditSaleForm({ sale }: { sale: CarSaleWithModel }) {
    const router = useRouter();
    const [make, setMake] = useState(sale.carModel.make);
    const [model, setModel] = useState(sale.carModel.model);
    const [version, setVersion] = useState(sale.carModel.version);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        models,
        versions,
        isModelsLoading,
        isVersionsLoading,
        error,
        handleMakeChange,
        handleModelChange
    } = useCarData(sale.carModel.make, sale.carModel.model);

    const form = useForm<z.infer<typeof saleSchema>>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            make: sale.carModel.make,
            model: sale.carModel.model,
            version: sale.carModel.version || "",
            carYear: sale.carYear,
            priceUsd: sale.priceUsd,
            priceArs: sale.priceArs,
            saleDate: new Date(sale.saleDate),
            location: sale.location,
            status: sale.status,
            notes: sale.notes || "",
        },
    });

    // Handle make changes
    useEffect(() => {
        if (make && make !== sale.carModel.make) {
            form.setValue("model", "");
            form.setValue("version", "");
            setModel("");
            handleMakeChange(make);
        }
    }, [make, form, sale.carModel.make]);

    // Handle model changes
    useEffect(() => {
        if (make && model && model !== sale.carModel.model) {
            form.setValue("version", "");
            handleModelChange(make, model);
        }
    }, [model, make, form, sale.carModel.model]);

    const onSubmit = async (data: z.infer<typeof saleSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/cars/sales/${sale.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    make: data.make,
                    model: data.model,
                    version: data.version || "",
                    carYear: data.carYear,
                    priceUsd: data.priceUsd,
                    priceArs: data.priceArs,
                    saleDate: data.saleDate,
                    location: data.location,
                    status: data.status,
                    notes: data.notes || "",
                }),
            });
            if (!response.ok) throw new Error("Error al actualizar la venta");
            router.push("/my-sales");
        } catch {
            form.setError("root", { message: "No se pudo actualizar la venta. Intente de nuevo." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-1/2 mx-auto">
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
                            <FormLabel>Marca del auto</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={makeOptions}
                                    placeholder="Seleccione una marca"
                                    onValueChange={(value) => {
                                        setMake(value);
                                        field.onChange(value);
                                    }}
                                    initialValue={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Model Field */}
                {isModelsLoading ? (
                    <LoadingIndicator message="Cargando modelos..." />
                ) : models.length === 0 ? (
                    make ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Sin modelos</AlertTitle>
                            <AlertDescription>
                                No se encontraron modelos para esta marca. Por favor, agregue un modelo{' '}
                                <Link href="/model" className="underline hover:text-white">
                                    aquí
                                </Link>.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <p className="text-muted-foreground">Seleccione una marca para cargar modelos.</p>
                    )
                ) : (
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo</FormLabel>
                                <FormControl>
                                    <Combobox
                                        items={models}
                                        placeholder="Seleccione un modelo"
                                        onValueChange={(value) => {
                                            setModel(value);
                                            field.onChange(value);
                                        }}
                                        initialValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Version Field */}
                {make ? (
                    model ? (
                        isVersionsLoading ? (
                            <LoadingIndicator message="Cargando versiones..." />
                        ) : versions.length === 0 ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Sin versiones</AlertTitle>
                                <AlertDescription>
                                    No se encontraron versiones para este modelo. Por favor, agregue una versión{' '}
                                    <Link href="/model" className="underline hover:text-white">
                                        aquí
                                    </Link>.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <FormField
                                control={form.control}
                                name="version"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Versión</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                items={versions}
                                                placeholder="Seleccione una versión"
                                                onValueChange={(value) => {
                                                    setVersion(value);
                                                    field.onChange(value);
                                                }}
                                                initialValue={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Si tu versión no está aquí, por favor carga el modelo{' '}
                                            <Link href="/model" className="underline hover:text-white">
                                                aquí
                                            </Link>.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    ) : (
                        <p className="text-muted-foreground">Seleccione un modelo para cargar versiones.</p>
                    )
                ) : null}

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="carYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Año del auto</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ingrese el año del auto"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priceUsd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio en dólares</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ingrese el precio en dólares"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
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
                                <FormLabel>Precio en pesos</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ingrese el precio en pesos"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
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
                                <FormLabel>Ubicación de la venta</FormLabel>
                                <FormControl>
                                    <Combobox
                                        items={provinceOptions}
                                        placeholder="Seleccione una provincia"
                                        onValueChange={field.onChange}
                                        initialValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado del vehículo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
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
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de venta</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
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

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Notas adicionales</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ingrese información adicional sobre la venta"
                                        className="min-h-24"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4 col-span-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/my-sales")}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}

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
            <span>{message}</span>
        </div>
    );
} 