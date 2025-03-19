import { useEffect, useRef } from "react"
import type { MapRef } from "react-map-gl/mapbox"

import { RESIZABLE_HANDLE_ID } from "./constants"

export function useResizableMapRef() {
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
