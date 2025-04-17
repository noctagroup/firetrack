import React from "react"

import { useLocalStorage } from "~shared/hooks/use-local-storage"
import { PrefersDarkColorScheme, Theme } from "~shared/hooks/use-theme/constants"
import { ThemeContext, ThemeContextInitialState } from "~shared/hooks/use-theme/context"
import { useTheme } from "~shared/hooks/use-theme/hooks"
import _script from "~shared/hooks/use-theme/script?inline"
import type { TTheme, TThemeContextProps, TThemeProviderProps } from "~shared/hooks/use-theme/types"

export function ThemeProvider({
  children,
  defaultTheme = ThemeContextInitialState.defaultTheme,
  themeStorageKey = ThemeContextInitialState.themeStorageKey,
}: TThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<TTheme>(themeStorageKey, defaultTheme)

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
    const root = window.document.documentElement

    root.classList.remove(Theme.Light, Theme.Dark)

    if (theme === "system") {
      const resolvedTheme: TTheme = window.matchMedia(PrefersDarkColorScheme).matches
        ? Theme.Dark
        : Theme.Light

      root.classList.add(resolvedTheme)
      return undefined
    }

    root.classList.add(theme)
  }, [theme])

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>
}

export function ThemeProviderScript() {
  const themeContext = useTheme()

  const script = _script.toString()
  const args = [themeContext, Theme, PrefersDarkColorScheme]
    .map((arg) => JSON.stringify(arg))
    .join(",")

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${script})(${args})`,
      }}
    />
  )
}
