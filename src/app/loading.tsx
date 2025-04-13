import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-72 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  )
}
