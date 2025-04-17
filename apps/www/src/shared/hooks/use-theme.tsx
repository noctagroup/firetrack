import React, { useEffect, useMemo } from "react"

import { useLocalStorage } from "~shared/hooks/use-local-storage"

const PrefersDarkColorScheme = "(prefers-color-scheme: dark)"

export const Theme = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const

export type TTheme = (typeof Theme)[keyof typeof Theme]

export type TThemeContextProps = {
  theme: TTheme
  setTheme: React.Dispatch<React.SetStateAction<TTheme>>
  defaultTheme: TTheme
  themeStorageKey: string
}

const initialState: TThemeContextProps = {
  theme: Theme.System,
  setTheme: () => undefined,
  defaultTheme: Theme.System,
  themeStorageKey: "theme",
}

const ThemeContext = React.createContext(initialState)

export function useTheme() {
  return React.useContext(ThemeContext)
}

export type TThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: TTheme
  themeStorageKey?: string
}>

export function ThemeProvider({
  children,
  defaultTheme = initialState.defaultTheme,
  themeStorageKey = initialState.themeStorageKey,
}: TThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<TTheme>(themeStorageKey, defaultTheme)

  const themeContext = useMemo<TThemeContextProps>(
    () => ({
      theme,
      setTheme,
      defaultTheme,
      themeStorageKey,
    }),
    [theme, setTheme, defaultTheme, themeStorageKey]
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(Theme.Light, Theme.Dark)

    if (theme === "system") {
      const systemTheme: TTheme = window.matchMedia(PrefersDarkColorScheme).matches
        ? Theme.Dark
        : Theme.Light

      root.classList.add(systemTheme)
      return undefined
    }

    root.classList.add(theme)
  }, [theme])

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>
}

export function ThemeProviderScript() {
  const themeContext = useTheme()

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${script.toString()})(${JSON.stringify(themeContext)})`,
      }}
    />
  )
}

const script = (context: TThemeContextProps) => {
  window.document.documentElement.classList.add(context.theme)
  console.log(context)
}
