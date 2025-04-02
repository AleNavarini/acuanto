import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, Car } from "lucide-react";

// Format price with Argentine Peso format
function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
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

interface TransactionProps {
  transaction: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    date: string;
    location: string;
    imageUrl: string;
  };
}

export default function TransactionCard({ transaction }: TransactionProps) {
  const { brand, model, year, price, date, location, imageUrl } = transaction;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${brand} ${model} ${year}`}
            fill
            className="object-cover"
          />
        ) : (
          <Car size="48" className="w-full h-full" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold">
          {brand} {model}
        </h3>
        <p className="text-muted-foreground">{year}</p>
        <p className="text-2xl font-bold mt-2">{formatPrice(price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
