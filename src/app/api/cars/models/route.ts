import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import based on your Prisma setup

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");

    if (!brand) {
        return NextResponse.json(
            { error: "Brand is required" },
            { status: 400 }
        );
    }

    try {
        const carModels = await prisma.carModel.findMany({
            where: {
                make: brand, // Filter by brand in the database
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