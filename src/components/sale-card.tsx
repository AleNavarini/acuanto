import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Car } from "lucide-react"
import type { CarSaleWithModel } from "@/types/car-sale-with-model"

// Format price with Argentine Peso format
function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format date to Argentine format
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const statusOptions = [
  { label: "Muy mal", value: "very_bad" },
  { label: "Mal", value: "bad" },
  { label: "Promedio", value: "average" },
  { label: "Bueno", value: "good" },
  { label: "Muy bueno", value: "very_good" },
]

// Get status label from value
function getStatusLabel(statusValue: string): string {
  const status = statusOptions.find((option) => option.value === statusValue)
  return status ? status.label : statusValue
}

// Get status color based on value
function getStatusColor(statusValue: string): string {
  switch (statusValue) {
    case "very_bad":
      return "bg-red-500 hover:bg-red-600"
    case "bad":
      return "bg-orange-500 hover:bg-orange-600"
    case "average":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "good":
      return "bg-green-500 hover:bg-green-600"
    case "very_good":
      return "bg-emerald-500 hover:bg-emerald-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export default function SaleCard({ sale }: { sale: CarSaleWithModel }) {
  const { carModel, carYear, location, notes, priceArs, priceUsd, saleDate, status } = sale

  const { make, model, version } = carModel

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        <Car size={64} className="text-gray-400" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">
            {make} {model} {version}
          </h3>
          <Badge className={`${getStatusColor(status)} text-white`}>{getStatusLabel(status)}</Badge>
        </div>
        <p className="text-muted-foreground">{carYear}</p>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">USD:</span>
            <p className="text-xl font-bold">{formatPrice(priceUsd, "USD")}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ARS:</span>
            <p className="text-xl font-bold">{formatPrice(priceArs, "ARS")}</p>
          </div>
        </div>

        {notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md text-sm">
            <p className="text-muted-foreground">{notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2 border-t mt-2">
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
  )
}
