export const env = {
  get MAPBOX_ACCESS_TOKEN() {
    return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  },
} as const
