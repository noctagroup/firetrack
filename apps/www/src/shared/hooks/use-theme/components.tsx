import React from "react"

import { CookieStorage, useStorage } from "~shared/hooks/use-storage"
import { PrefersDarkColorScheme, Theme } from "~shared/hooks/use-theme/constants"
import { ThemeContext, ThemeContextInitialState } from "~shared/hooks/use-theme/context"
import { useTheme } from "~shared/hooks/use-theme/hooks"
import script from "~shared/hooks/use-theme/script?inline"
import type { TTheme, TThemeContextProps, TThemeProviderProps } from "~shared/hooks/use-theme/types"

const cookieStorage = new CookieStorage<TTheme>()

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
    const rootEl = window.document.documentElement

    rootEl.classList.remove(Theme.Light, Theme.Dark)

    if (theme === Theme.System) {
      const resolvedTheme: TTheme = window.matchMedia(PrefersDarkColorScheme).matches
        ? Theme.Dark
        : Theme.Light

      rootEl.classList.add(resolvedTheme)
    } else {
      rootEl.classList.add(theme)
    }
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
