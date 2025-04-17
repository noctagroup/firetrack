import React from "react"

import { useStorage } from "~shared/hooks/use-storage"
import { CookieStorage } from "~shared/hooks/use-storage/storage/cookie"
import { ThemeContext, ThemeContextInitialState } from "~shared/hooks/use-theme/context"
import { applyTheme } from "~shared/hooks/use-theme/dom"
import { useTheme } from "~shared/hooks/use-theme/hooks"
import script from "~shared/hooks/use-theme/script"
import type { TTheme, TThemeContextProps, TThemeProviderProps } from "~shared/hooks/use-theme/types"

// TODO: tornar global
const cookieStorage = new CookieStorage<TTheme>()

export function ThemeProvider({
  children,
  defaultTheme = ThemeContextInitialState.defaultTheme,
  themeStorageKey = ThemeContextInitialState.themeStorageKey,
}: TThemeProviderProps) {
  const [theme, setTheme] = useStorage(themeStorageKey, defaultTheme, cookieStorage)

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

  const scriptString = script.toString()
  const argString = JSON.stringify(themeContext)

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${scriptString})(${argString})`,
      }}
    />
  )
}
