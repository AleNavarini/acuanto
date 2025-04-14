import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { EditSaleForm } from "@/components/sales/edit-sale-form";
import { Loader2 } from "lucide-react";

export default async function EditSalePage({ params }: { params: { id: string } }) {
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

    const sale = await prisma.carSale.findFirst({
        where: {
            id: parseInt(params.id),
            userId: user.id,
        },
        include: {
            carModel: true,
        },
    });

    if (!sale) {
        redirect("/my-sales");
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Editar Venta</h1>
            <div className="relative">
                <EditSaleForm sale={sale} />
                <div id="loading-overlay" className="hidden absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Guardando cambios...</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 