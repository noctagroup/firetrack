import React from "react"

import { Mapbox } from "~fenomeno/components/mapbox"
import { useDebounced } from "~shared/hooks/use-debounced"
import { useResizeObserver } from "~shared/hooks/use-resize-observer"
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"

export default function FenomenoIndex() {
  const debouncedMapResize = useDebounced(() => window.dispatchEvent(new Event("resize")))

  useResizeObserver("fenomeno_sidebar", debouncedMapResize)

  return (
    <React.Suspense fallback={<Skeleton className="h-full" />}>
      <Mapbox />
    </React.Suspense>
  )
}
