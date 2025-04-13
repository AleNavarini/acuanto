
"use client"

import { useRouter } from 'next/navigation'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { carBrands as carMakes } from "@/data/carBrands";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Combobox } from "./ui/combobox";
import { Input } from "./ui/input";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

const carModelSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    version: z.string().min(1, "Version is required"),
});


// Map carBrands to the Autocomplete format
const makeOptions = carMakes.map((brand) => ({
    label: brand.label,
    value: brand.value,
}));

export function ModelForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const modelForm = useForm<z.infer<typeof carModelSchema>>({
        resolver: zodResolver(carModelSchema),
        defaultValues: {
            make: "",
            model: "",
            version: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof carModelSchema>) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/cars/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    make: data.make,
                    model: data.model,
                    version: data.version || "", // Default to empty string if no version
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create model");
            }
            router.push("/sale");

        } catch {

        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Form {...modelForm}>
            <form onSubmit={modelForm.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-3">
                    <FormField
                        control={modelForm.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca del auto</FormLabel>
                                <FormControl>
                                    <Combobox
                                        items={makeOptions}
                                        placeholder="Elija una marca"
                                        onValueChange={(value) => field.onChange(value)} // Changed to onValueChange
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={modelForm.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo del auto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Escriba su modelo (Corolla, Polo, Vento)"
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={modelForm.control}
                        name="version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version del auto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Escriba su version (XEI, GTS, GLI)"
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="cursor-pointer">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" />
                            :
                            <div>
                                <PlusCircle />
                                Crear Modelo
                            </div>
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )

}