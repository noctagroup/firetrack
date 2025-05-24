import React from "react"

import { env } from "~shared/env"

export const QueryDevtools = env.DEV
  ? React.lazy(async () => {
      return {
        default: (await import("@tanstack/react-query-devtools")).ReactQueryDevtools,
      }
    })
  : () => undefined
