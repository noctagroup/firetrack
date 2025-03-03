import * as React from "react"

export const Mapbox = React.lazy(async () => {
  const { DO_NOT_USE_INTERNAL_MAPBOX } = await import("./mapbox")

  return { default: DO_NOT_USE_INTERNAL_MAPBOX }
})
