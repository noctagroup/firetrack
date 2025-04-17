import React from "react"

import { useStorage } from "~shared/hooks/use-storage"
import { cookieStorage } from "~shared/hooks/use-storage/storage/cookie"
import { PrefersDarkColorScheme } from "~shared/hooks/use-theme/constants"
import { ThemeContext, ThemeContextInitialState } from "~shared/hooks/use-theme/context"
import { applyTheme } from "~shared/hooks/use-theme/dom"
import { useTheme } from "~shared/hooks/use-theme/hooks"
import script from "~shared/hooks/use-theme/script"
import type { TTheme, TThemeContextProps, TThemeProviderProps } from "~shared/hooks/use-theme/types"

export function ThemeProvider({
  children,
  defaultTheme = ThemeContextInitialState.defaultTheme,
  themeStorageKey = ThemeContextInitialState.themeStorageKey,
}: TThemeProviderProps) {
  const [theme, setTheme] = useStorage<TTheme>(themeStorageKey, defaultTheme, cookieStorage)

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
    const media = window.matchMedia(PrefersDarkColorScheme)
    const applyThemeListener = () => applyTheme(theme, media)

    applyThemeListener()

    media.addEventListener("change", applyThemeListener)

    return () => {
      media.removeEventListener("change", applyThemeListener)
    }
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
