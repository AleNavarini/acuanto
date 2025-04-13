import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");

    if (!make) {
        return NextResponse.json(
            { error: "Brand is required" },
            { status: 400 }
        );
    }

    try {
        const carModels = await prisma.carModel.findMany({
            where: {
                make: make,
            },
            select: {
                id: true,
                make: true,
                model: true,
                version: true,
            },
        });

        return NextResponse.json({ models: carModels });
    } catch (error) {
        console.error("Error fetching car models:", error);
        return NextResponse.json(
            { error: "Failed to fetch car models" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { make, model, version } = await request.json();

        const foundModel = await prisma.carModel.findFirst({
            where: {
                make,
                model,
                version
            }
        });
        if (foundModel) return NextResponse.json({ error: "This car model already exists" }, { status: 400 });

        const newModel = await prisma.carModel.create({
            data: {
                make,
                model,
                version
            }

        });

        return NextResponse.json({ newModel });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}