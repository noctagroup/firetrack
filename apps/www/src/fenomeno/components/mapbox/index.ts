import * as React from "react"

export const Mapbox = React.lazy(async () => {
  const { __DO_NOT_USE_INTERNAL_MAPBOX__ } = await import("./mapbox")

  return { default: __DO_NOT_USE_INTERNAL_MAPBOX__ }
})
