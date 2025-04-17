import type { TTheme, TThemeContextProps } from "~shared/hooks/use-theme/types"

export default function themeScript(context: TThemeContextProps) {
  const Theme = {
    System: "system",
    Light: "light",
    Dark: "dark",
  } as const

  const PrefersDarkColorScheme = "(prefers-color-scheme: dark)"

  function parseCookieTheme(): string | undefined {
    const cookie = window.document.cookie.split(";").reduce((cookieAcc, currCookie) => {
      const currCookieSplit = currCookie.trim().split("=")

      if (currCookieSplit[0] !== context.themeStorageKey) {
        return cookieAcc
      } else {
        try {
          const nextCookieAcc = JSON.parse(decodeURIComponent(currCookieSplit[1]))

          return nextCookieAcc
        } catch {
          return cookieAcc
        }
      }
    }, undefined)

    return cookie
  }

  function applyTheme(theme: TTheme): void {
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

  const cookieTheme = parseCookieTheme()

  applyTheme((cookieTheme as TTheme) || context.defaultTheme)
}
