import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const sales = await prisma.carSale.findMany({})
    return NextResponse.json(sales)
}