import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SalesList from "@/components/sales/sales-list";

export default async function MySalesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        redirect("/login");
    }

    const sales = await prisma.carSale.findMany({
        where: {
            userId: user.id,
        },
        include: {
            carModel: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Mis Ventas</h1>
            <SalesList initialSales={sales} showEditButton={true} />
        </div>
    );
} 