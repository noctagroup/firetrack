import "mapbox-gl/dist/mapbox-gl.css"

import mapboxGl from "mapbox-gl"
import type { ComponentProps } from "react"
import Mapbox from "react-map-gl/mapbox"

import { env } from "~shared/env"

export function __DO_NOT_USE_INTERNAL_MAPBOX__({ ...props }: ComponentProps<typeof Mapbox>) {
  return (
    <Mapbox
      {...props}
      style={{ height: "100%" }}
      mapLib={mapboxGl}
      mapboxAccessToken={env.MAPBOX_ACCESS_TOKEN}
      projection="mercator"
      language="name_pt"
      // https://docs.mapbox.com/api/maps/styles/#classic-mapbox-styles
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      dragRotate={false}
      renderWorldCopies={false}
      RTLTextPlugin={false}
      maxZoom={20}
      minZoom={0}></Mapbox>
  )
}
