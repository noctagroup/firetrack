import * as React from "react"

import { Mapbox } from "~home/components/mapbox"
import { MAP_PANEL_ID, SIDEBAR_ID } from "~home/constants"
import { useDebounced } from "~shared/hooks/use-debounced"
import { useResizeObserver } from "~shared/hooks/use-resize-observer"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~shared/lib/shadcn/ui/resizable"
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}

export default function HomeIndex() {
  const debouncedMapResize = useDebounced(() => window.dispatchEvent(new Event("resize")), 0)

  useResizeObserver(MAP_PANEL_ID, debouncedMapResize)
  useResizeObserver(SIDEBAR_ID, debouncedMapResize)

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="px-6 py-8"
        defaultSize={25}
        minSize={20}
        maxSize={40}></ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel id={MAP_PANEL_ID}>
        <React.Suspense fallback={<Skeleton className="h-full" />}>
          <Mapbox />
        </React.Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
