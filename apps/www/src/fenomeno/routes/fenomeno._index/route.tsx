import React from "react"

import { Mapbox } from "~fenomeno/components/mapbox"
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"

export default function FenomenoIndex() {
  return (
    <React.Suspense fallback={<Skeleton className="h-full" />}>
      <Mapbox />
    </React.Suspense>
  )
}
