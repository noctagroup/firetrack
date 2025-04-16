import React, { useEffect, useMemo } from "react"

import { useLocalStorage } from "~shared/hooks/use-local-storage"

export const Theme = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const
export type TTheme = (typeof Theme)[keyof typeof Theme]
export type TThemeContextProps = {
  theme: TTheme
  setTheme: React.Dispatch<React.SetStateAction<TTheme>>
}
export type TThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: TTheme
  storageKey?: string
}>

const initialState: TThemeContextProps = {
  theme: Theme.System,
  setTheme: () => undefined,
}

const ThemeContext = React.createContext(initialState)

export function useTheme() {
  return React.useContext(ThemeContext)
}

export function ThemeProvider({
  children,
  defaultTheme = initialState.theme,
  storageKey = "theme",
}: TThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<TTheme>(storageKey, defaultTheme)

  const themeContext = useMemo<TThemeContextProps>(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(Theme.Light, Theme.Dark)

    if (theme === "system") {
      const systemTheme: TTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Theme.Dark
        : Theme.Light

      root.classList.add(systemTheme)
      return undefined
    }

    root.classList.add(theme)
  }, [theme])

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>
}
