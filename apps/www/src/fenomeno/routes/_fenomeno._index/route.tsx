import * as React from "react"
import type { MapRef } from "react-map-gl/mapbox"

import { Mapbox } from "~fenomeno/components/mapbox"
import { RESIZABLE_HANDLE_ID, RESIZABLE_SIDEBAR_ID } from "~fenomeno/constants"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~shared/lib/shadcn/ui/resizable"
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}

export default function FenomenoIndex() {
  const mapRef = React.useRef<MapRef>(null)

  React.useEffect(() => {
    const handleEl = document.getElementById(RESIZABLE_HANDLE_ID)!
    const observer = new MutationObserver(() => {
      if (!mapRef.current?.resize) return undefined

      setTimeout(() => mapRef.current!.resize(), 0)
    })

    observer.observe(handleEl, { attributeFilter: ["aria-valuenow"] })

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const sidebarEl = document.getElementById(RESIZABLE_SIDEBAR_ID)!
    const observer = new ResizeObserver(() => {
      if (!mapRef.current?.resize) return undefined

      setTimeout(() => mapRef.current!.resize(), 0)
    })

    observer.observe(sidebarEl)

    return () => observer.disconnect()
  }, [])

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="px-6 py-8"
        defaultSize={25}
        minSize={20}
        maxSize={40}></ResizablePanel>

      <ResizableHandle id={RESIZABLE_HANDLE_ID} withHandle />

      <ResizablePanel>
        <React.Suspense fallback={<Skeleton className="h-full" />}>
          <Mapbox ref={mapRef} />
        </React.Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
