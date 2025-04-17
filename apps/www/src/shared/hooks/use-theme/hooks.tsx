import * as React from "react"

import { ThemeContext } from "~shared/hooks/use-theme/context"

export function useTheme() {
  return React.useContext(ThemeContext)
}
