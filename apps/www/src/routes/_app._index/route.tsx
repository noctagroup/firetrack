import { Suspense } from "react"

import { Mapbox } from "~/components/mapbox"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Skeleton } from "~/components/ui/skeleton"

import { RESIZABLE_HANDLE_ID } from "./constants"
import { useResizableMapRef } from "./hooks"

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}

export default function AppIndex() {
  const mapRef = useResizableMapRef()

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="px-6 py-8" defaultSize={25} minSize={20} maxSize={40}>
        asdf
      </ResizablePanel>

      <ResizableHandle id={RESIZABLE_HANDLE_ID} withHandle />

      <ResizablePanel>
        <Suspense fallback={<Skeleton className="h-full" />}>
          <Mapbox ref={mapRef} />
        </Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
