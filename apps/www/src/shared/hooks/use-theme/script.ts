import type {
  PrefersDarkColorScheme as _PrefersDarkColorScheme,
  Theme as _Theme,
} from "~shared/hooks/use-theme/constants"
import type { TTheme, TThemeContextProps } from "~shared/hooks/use-theme/types"

export default function (
  context: TThemeContextProps,
  Theme: typeof _Theme,
  PrefersDarkColorScheme: typeof _PrefersDarkColorScheme
) {
  const rootEl = window.document.documentElement
  const systemTheme: TTheme = window.matchMedia(PrefersDarkColorScheme).matches
    ? Theme.Dark
    : Theme.Light

  rootEl.classList.add(systemTheme)
  console.log(context)
}
