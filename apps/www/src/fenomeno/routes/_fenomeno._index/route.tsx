import { Suspense } from "react"

import { Mapbox } from "~fenomeno/components/mapbox"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~shared/lib/shadcn/ui/resizable"
import { Skeleton } from "~shared/lib/shadcn/ui/skeleton"

import { RESIZABLE_HANDLE_ID } from "./constants"
import { useResizableMapRef } from "./hooks"

export const handle = {
  breadcrumb: "Cicatrizes de Queimadas",
}

export default function AppIndex() {
  const mapRef = useResizableMapRef()

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="px-6 py-8"
        defaultSize={25}
        minSize={20}
        maxSize={40}></ResizablePanel>

      <ResizableHandle id={RESIZABLE_HANDLE_ID} withHandle />

      <ResizablePanel>
        <Suspense fallback={<Skeleton className="h-full" />}>
          <Mapbox ref={mapRef} />
        </Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
