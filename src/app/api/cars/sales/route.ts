import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const sales = await prisma.carSale.findMany({})
    return NextResponse.json(sales)
}


// Define the schema for the incoming request body
const saleInputSchema = z.object({
    make: z.string().min(1, "La marca es requerida"),
    model: z.string().min(1, "El modelo es requerido"),
    version: z.string(),
    carYear: z.number().min(1900).max(new Date().getFullYear()),
    priceUsd: z.number().min(0, "El precio no puede ser negativo"),
    priceArs: z.number().min(0, "El precio no puede ser negativo"),
    saleDate: z.string().transform((val) => new Date(val)),
    location: z.string().min(1, "La ubicación es requerida"),
    status: z.string().min(1, "El estado es requerido"),
    notes: z.string().nullable(),
});

export async function POST(request: Request) {
    try {
        // Parse and validate the incoming JSON body
        const rawData = await request.json();
        const data = saleInputSchema.parse(rawData);

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Usuario no autenticado" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuario no encontrado en la base de datos" },
                { status: 401 }
            );
        }

        // Find the CarModel based on make, model, and version
        const carModel = await prisma.carModel.findFirst({
            where: {
                make: data.make,
                model: data.model,
                version: data.version,
            },
        });

        // If no CarModel is found, return an error
        if (!carModel) {
            return NextResponse.json(
                {
                    error: "No se encontró un modelo de auto con la marca, modelo y versión proporcionados. Por favor, agréguelo primero.",
                },
                { status: 400 }
            );
        }

        // Create the CarSale with the relation to CarModel
        const sale = await prisma.carSale.create({
            data: {
                carModelId: carModel.id,
                carYear: data.carYear,
                priceUsd: data.priceUsd,
                priceArs: data.priceArs,
                saleDate: data.saleDate,
                location: data.location,
                status: data.status,
                notes: data.notes || "",
                userId: user.id,
            },
        });

        // Return the created sale
        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error("Error creating sale:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Datos inválidos: " + error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "No se pudo crear la venta. Intente de nuevo." },
            { status: 500 }
        );
    }
}