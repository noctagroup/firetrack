import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

import { ThemeProvider } from "~shared/hooks/use-theme"

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ThemeProvider>
        <HydratedRouter />
      </ThemeProvider>
    </StrictMode>
  )
})
