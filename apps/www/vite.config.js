import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import url from "url"

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "~shared": url.fileURLToPath(new url.URL("./src/shared", import.meta.url)),
      "~conta": url.fileURLToPath(new url.URL("./src/conta", import.meta.url)),
      "~deteccao": url.fileURLToPath(new url.URL("./src/deteccao", import.meta.url)),
    },
  },
})
