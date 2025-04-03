import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

        return NextResponse.json({ exists: !!foundModel });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
