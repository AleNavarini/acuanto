import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const sales = await prisma.carSale.findMany({})
    return NextResponse.json(sales)
}