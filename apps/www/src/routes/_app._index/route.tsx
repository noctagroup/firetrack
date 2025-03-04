import { Suspense } from "react"

import { Mapbox } from "~/components/mapbox"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Skeleton } from "~/components/ui/skeleton"
import { Typography } from "~/components/ui/typography"

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
        <Typography variant="h1">h1</Typography>
        <Typography variant="h2">h2</Typography>
        <Typography variant="h3">h3</Typography>
        <Typography variant="h4">h4</Typography>
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
