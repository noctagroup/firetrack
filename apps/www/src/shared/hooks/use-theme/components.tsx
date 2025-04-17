import React from "react"

import { useCookie } from "~shared/hooks/use-cookie"
import { ThemeContext, ThemeContextInitialState } from "~shared/hooks/use-theme/context"
import { applyTheme } from "~shared/hooks/use-theme/core"
import { useTheme } from "~shared/hooks/use-theme/hooks"
import script from "~shared/hooks/use-theme/script?inline"
import type { TTheme, TThemeContextProps, TThemeProviderProps } from "~shared/hooks/use-theme/types"

export function ThemeProvider({
  children,
  defaultTheme = ThemeContextInitialState.defaultTheme,
  themeStorageKey = ThemeContextInitialState.themeStorageKey,
}: TThemeProviderProps) {
  const [theme, setTheme] = useCookie<TTheme>(themeStorageKey, defaultTheme)

  const themeContext = React.useMemo<TThemeContextProps>(
    () => ({
      theme,
      setTheme,
      defaultTheme,
      themeStorageKey,
    }),
    [theme, setTheme, defaultTheme, themeStorageKey]
  )

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>
}

export function ThemeProviderScript() {
  const themeContext = useTheme()

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${script.toString()})(${JSON.stringify(themeContext)})`,
      }}
    />
  )
}
