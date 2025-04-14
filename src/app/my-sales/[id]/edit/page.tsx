import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { EditSaleForm } from "@/components/sales/edit-sale-form";

export default async function EditSalePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        redirect("/api/auth/signin");
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
            <div className=" p-6 rounded-lg shadow">
                <EditSaleForm sale={sale} />
            </div>
        </div>
    );
} 