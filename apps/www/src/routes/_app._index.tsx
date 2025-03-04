import { Suspense, useEffect, useRef } from "react"
import type { MapRef } from "react-map-gl/mapbox"

import { Mapbox } from "~/components/mapbox"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Skeleton } from "~/components/ui/skeleton"

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}

export default function AppIndex() {
  const mapRef = useResizableMapRef()

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}></ResizablePanel>

      <ResizableHandle id={RESIZABLE_HANDLE_ID} withHandle />

      <ResizablePanel>
        <Suspense fallback={<Skeleton className="h-full" />}>
          <Mapbox ref={mapRef} />
        </Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function useResizableMapRef() {
  const ref = useRef<MapRef>(null)

  useEffect(() => {
    const handleEl = document.getElementById(RESIZABLE_HANDLE_ID)!
    const observer = new MutationObserver(() => {
      if (!ref.current?.resize) return undefined

      ref.current.resize()
    })

    observer.observe(handleEl, { attributeFilter: ["aria-valuenow"] })

    return () => observer.disconnect()
  }, [])

  return ref
}

const RESIZABLE_HANDLE_ID = "resizable-handle"
