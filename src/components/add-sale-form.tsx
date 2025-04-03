// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
// import { Combobox } from "@/components/ui/combobox";
// import { provinces } from "@/data/provinces";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";



// // Car sale schema
// const carSaleSchema = z.object({
//   priceUSD: z.string()
//     .min(1, "USD price is required")
//     .refine(val => !isNaN(Number(val)), "Price must be a number"),
//   priceARS: z.string()
//     .min(1, "ARS price is required")
//     .refine(val => !isNaN(Number(val)), "Price must be a number"),
//   year: z.string().min(1, "Year is required"),
//   condition: z.string().min(1, "Condition is required"),
//   location: z.string().min(1, "Location is required"),
//   notes: z.string().optional(),
// });

// const conditionOptions = [
//   { label: "Very Bad", value: "very_bad" },
//   { label: "Bad", value: "bad" },
//   { label: "Regular", value: "regular" },
//   { label: "Good", value: "good" },
//   { label: "Very Good", value: "very_good" },
// ];

// const generateYears = () => {
//   const year = new Date().getFullYear();
//   return Array.from({ length: 31 }, (_, i) => ({
//     label: (year - i).toString(),
//     value: (year - i).toString(),
//   }));
// };

// export function AddSaleForm() {
//   const [step, setStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [years] = useState(generateYears());



//   // Form for car sale step
//   const saleForm = useForm<z.infer<typeof carSaleSchema>>({
//     resolver: zodResolver(carSaleSchema),
//     defaultValues: {
//       priceUSD: "",
//       priceARS: "",
//       year: new Date().getFullYear().toString(),
//       condition: "good",
//       location: "",
//       notes: "",
//     },
//   });



//   // Convert provinces to the format expected by Combobox
//   const locationOptions = provinces.map(province => ({
//     label: province.label,
//     value: province.value,
//   }));

//   // Check if car model exists
//   const checkCarModel = async (data: z.infer<typeof carModelSchema>) => {
//     setIsCheckingModel(true);
//     try {
//       // Here you would make an API call to check if the model exists
//       // For now, we'll simulate with a timeout
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       // Simulate API response - in a real app, this would be the result of your fetch
//       const response = await fetch('/api/car-models/check', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       setCarModelExists(result.exists);

//       if (!result.exists) {
//         // If model doesn't exist, create it
//         await createCarModel(data);
//       }

//       // Move to next step
//       setStep(2);
//     } catch (error) {
//       console.error("Error checking car model:", error);
//     } finally {
//       setIsCheckingModel(false);
//     }
//   };

//   // Create new car model
//   const createCarModel = async (data: z.infer<typeof carModelSchema>) => {
//     try {
//       // Here you would make an API call to create the model
//       await fetch('/api/car-models', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });
//     } catch (error) {
//       console.error("Error creating car model:", error);
//     }
//   };

//   // Submit car sale
//   const submitCarSale = async (data: z.infer<typeof carSaleSchema>) => {
//     setIsSubmitting(true);
//     try {
//       // Combine data from both forms
//       const fullData = {
//         ...modelForm.getValues(),
//         ...data,
//       };

//       // Here you would make an API call to save the car sale
//       await fetch('/api/car-sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(fullData),
//       });

//       // Reset forms and go back to step 1
//       modelForm.reset();
//       saleForm.reset();
//       setStep(1);

//       // Show success message or redirect
//     } catch (error) {
//       console.error("Error submitting car sale:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         {step === 1 ? (
//           <Form {...modelForm}>
//             <form id="car-model-form" onSubmit={modelForm.handleSubmit(checkCarModel)}>
//               <div className="space-y-4">
//                 <FormField
//                   control={modelForm.control}
//                   name="brand"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Car Brand</FormLabel>
//                       <FormControl>
//                         <Combobox
//                           items={brandOptions}
//                           placeholder="Select a brand"
//                           selectedValue={field.value}
//                           onChange={(value) => field.onChange(value)}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={modelForm.control}
//                   name="model"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Model</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter car model" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={modelForm.control}
//                   name="version"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Version (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter version or trim level" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <Button type="submit" disabled={isCheckingModel} className="w-full">
//                   {isCheckingModel ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Checking Model
//                     </>
//                   ) : (
//                     <>
//                       Continue
//                       <ChevronRight className="ml-2 h-4 w-4" />
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         ) : (
//           <Form {...saleForm}>
//             <form id="car-sale-form" onSubmit={saleForm.handleSubmit(submitCarSale)}>
//               <div className="space-y-4">
//                 <div className="flex flex-col gap-1">
//                   <Label className="text-sm text-gray-500">
//                     {modelForm.getValues().brand} {modelForm.getValues().model}{" "}
//                     {modelForm.getValues().version}
//                   </Label>
//                   {carModelExists === false && (
//                     <Label className="text-xs text-green-600">
//                       New model created in database
//                     </Label>
//                   )}
//                 </div>

//                 <FormField
//                   control={saleForm.control}
//                   name="priceUSD"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price (USD)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter price in USD"
//                           {...field}
//                           type="text"
//                           inputMode="decimal"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={saleForm.control}
//                   name="priceARS"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price (ARS)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter price in ARS"
//                           {...field}
//                           type="text"
//                           inputMode="decimal"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={saleForm.control}
//                   name="year"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Year</FormLabel>
//                       <FormControl>
//                         <Combobox
//                           items={years}
//                           placeholder="Select year"
//                           selectedValue={field.value}
//                           onChange={(value) => field.onChange(value)}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={saleForm.control}
//                   name="condition"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Condition</FormLabel>
//                       <FormControl>
//                         <Combobox
//                           items={conditionOptions}
//                           placeholder="Select condition"
//                           selectedValue={field.value}
//                           onChange={(value) => field.onChange(value)}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={saleForm.control}
//                   name="location"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Location</FormLabel>
//                       <FormControl>
//                         <Combobox
//                           items={locationOptions}
//                           placeholder="Select location"
//                           selectedValue={field.value}
//                           onChange={(value) => field.onChange(value)}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={saleForm.control}
//                   name="notes"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Notes (Optional)</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Enter additional details about the car"
//                           {...field}
//                           rows={3}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setStep(1)}
//                     className="w-1/2"
//                   >
//                     <ChevronLeft className="mr-2 h-4 w-4" />
//                     Back
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting} className="w-1/2">
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Submitting
//                       </>
//                     ) : (
//                       "Submit Sale"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           </Form>
//         )}
//       </CardContent>
//     </Card>
//   );
// }