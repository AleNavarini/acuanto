"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { provinces } from "@/data/provinces"
import { carBrands } from "@/data/carBrands"

const generateYears = () => {
  const year = new Date().getFullYear();
  return Array.from({ length: 31 }, (_, i) => (year - i).toString());
};


export function AddSaleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    setYears(generateYears());
  }, []);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    version: "",
    year: new Date().getFullYear().toString(),
    price: "",
    condition: "",
    location: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Combobox
              items={carBrands}
              selectedValue={formData.brand}
              onChange={(value) => handleSelectChange("brand", value)}
              placeholder="Selecciona o ingresa una marca"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Combobox
              items={provinces}
              selectedValue={formData.location}
              onChange={(value) => handleSelectChange("location", value)}
              placeholder="Selecciona o ingresa una ubicación"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Ingrese el modelo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Ingrese el precio"
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Publicar Venta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}