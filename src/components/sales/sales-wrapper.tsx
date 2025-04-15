import prisma from "@/lib/prisma";
import SalesList from "./sales-list";
import { CarSaleWithModel } from "@/types/car-sale-with-model";

export const revalidate = 60

const fetchSales = async () => {
    const sales: CarSaleWithModel[] = await prisma.carSale.findMany({
        include: {
            carModel: true
        }
    })
    return sales
}


export async function SalesWrapper() {
    const sales = await fetchSales()
    return <SalesList initialSales={sales} />
}