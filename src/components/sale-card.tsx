import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, Car } from "lucide-react";
import { CarSale } from "@prisma/client";
import { CarSaleWithModel } from "@/types/car-sale-with-model";

// Format price with Argentine Peso format
function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format date to Argentine format
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


export default function SaleCard({ sale }: { sale: CarSaleWithModel }) {
  const {
    carModel,
    carYear,
    location,
    notes,
    priceArs,
    priceUsd,
    saleDate,
    status,
  } = sale;

  const {
    make,
    model,
    version
  } = carModel

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Car size="48" className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold">
          {make} {model}
        </h3>
        <p className="text-muted-foreground">{carYear}</p>
        <p className="text-2xl font-bold mt-2">{formatPrice(priceUsd, "usd")}</p>
        <p className="text-2xl font-bold mt-2"> {formatPrice(priceArs, "ars")}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(saleDate.toString())}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
