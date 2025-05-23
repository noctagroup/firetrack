export const env = {
  get MAPBOX_ACCESS_TOKEN() {
    return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  },
  get API_URL() {
    return import.meta.env.VITE_API_URL || "http://localhost:8000"
  },
  get DEV() {
    return import.meta.env.MODE === "development"
  },
} as const
