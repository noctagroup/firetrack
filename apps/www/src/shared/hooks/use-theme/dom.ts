import { PrefersDarkColorScheme, Theme } from "~shared/hooks/use-theme/constants"
import type { TTheme } from "~shared/hooks/use-theme/types"

export function applyTheme(theme: TTheme): void {
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
}
