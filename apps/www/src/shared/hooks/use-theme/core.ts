import { PrefersDarkColorScheme, Theme } from "~shared/hooks/use-theme/constants"
import type { TTheme } from "~shared/hooks/use-theme/types"

export function applyTheme(theme: TTheme) {
  const rootEl = window.document.documentElement

  rootEl.classList.remove(Theme.Light, Theme.Dark)

  if (theme === "system") {
    const resolvedTheme: TTheme = window.matchMedia(PrefersDarkColorScheme).matches
      ? Theme.Dark
      : Theme.Light

    rootEl.classList.add(resolvedTheme)
  } else {
    rootEl.classList.add(theme)
  }
}
