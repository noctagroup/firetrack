import { Suspense } from "react"

import { Mapbox } from "~/components/mapbox"
import { Skeleton } from "~/components/ui/skeleton"

export default function AppIndex() {
  return (
    <Suspense fallback={<Skeleton className="h-full" />}>
      <Mapbox />
    </Suspense>
  )
}

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}
