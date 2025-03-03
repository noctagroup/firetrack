import { Suspense } from "react"

import { Mapbox } from "~/components/mapbox"
import { Skeleton } from "~/components/ui/skeleton"

export default function Home() {
  return (
    <Suspense fallback={<Skeleton className="h-full" />}>
      <Mapbox />
    </Suspense>
  )
}
