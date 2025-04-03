"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

// Generate current year and previous 30 years for the select
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 31 }, (_, i) => currentYear - i)

// List of common car brands
const carBrands = [
  "Toyota",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Honda",
  "Hyundai",
  "Nissan",
  "Renault",
  "Fiat",
  "Peugeot",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Kia",
  "Mazda",
  "Otro",
]

// List of Argentine locations
const locations = [
    "CABA",
  "Provincia de Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "San Miguel de Tucumán",
  "La Plata",
  "Mar del Plata",
  "Salta",
  "Santa Fe",
  "San Juan",
  "Resistencia",
  "Neuquén",
  "Otro",
]

export function AddTransactionForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: currentYear.toString(),
    price: "",
    location: "Buenos Aires",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      // Redirect to login if not authenticated
      router.push("/signin")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      console.log("Submitting transaction:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard after successful submission
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ej. Corolla"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (ARS)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ej. 12500000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre el vehículo..."
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar transacción
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancelar
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

