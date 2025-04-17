import * as React from "react"

import { Theme } from "~shared/hooks/use-theme/constants"
import type { TThemeContextProps } from "~shared/hooks/use-theme/types"

export const ThemeContextInitialState: TThemeContextProps = {
  theme: Theme.System,
  setTheme: () => undefined,
  defaultTheme: Theme.System,
  themeStorageKey: "theme",
} as const

export const ThemeContext = React.createContext(ThemeContextInitialState)
