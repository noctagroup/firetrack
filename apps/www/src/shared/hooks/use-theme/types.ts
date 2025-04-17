import type { Theme } from "~shared/hooks/use-theme/constants"

export type TTheme = (typeof Theme)[keyof typeof Theme]

export type TThemeContextProps = {
  theme: TTheme
  setTheme: React.Dispatch<React.SetStateAction<Nullable<TTheme>>>
  defaultTheme: TTheme
  themeStorageKey: string
}

export type TThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: TTheme
  themeStorageKey?: string
}>
