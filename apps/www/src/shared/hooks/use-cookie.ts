import Cookie from "js-cookie"
import * as React from "react"

import { isNil } from "~shared/utils/is"

const cookieChangedEventType = "cookiechanged"

export function useCookie<T extends string>(
  cookieName: string,
  cookieInitialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = React.useCallback(() => getCookie(cookieName), [cookieName])

  const store = React.useSyncExternalStore<string | undefined>(useCookieSubscribe, getSnapshot)

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (_nextState) => {
      const nextState =
        typeof _nextState === "function"
          ? (_nextState as (value: T) => T)(JSON.parse(store!))
          : _nextState

      if (isNil(nextState)) {
        removeCookie(cookieName)
      } else {
        setCookie(cookieName, nextState)
      }
    },
    [cookieName, store]
  )

  React.useEffect(() => {
    if (isNil(getCookie(cookieName)) && typeof cookieInitialValue !== "undefined") {
      setCookie(cookieName, cookieInitialValue)
    }
  }, [cookieName, cookieInitialValue])

  return [store ? JSON.parse(store) : cookieInitialValue, setState]
}

function dispatchCookieEvent(cookieName: string, cookieNewValue?: string | null) {
  window.dispatchEvent(
    new CustomEvent(cookieChangedEventType, { detail: { cookieName, cookieNewValue } })
  )
}

function getCookie(cookieName: string) {
  return Cookie.get(cookieName)
}

function removeCookie(cookieName: string) {
  Cookie.remove(cookieName)
  dispatchCookieEvent(cookieName, undefined)
}

function setCookie<T>(cookieName: string, value: T) {
  const stringifiedValue = JSON.stringify(value)
  Cookie.set(cookieName, stringifiedValue)
  dispatchCookieEvent(cookieName, stringifiedValue)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useCookieSubscribe<Fn extends (...args: any[]) => any>(callback: Fn) {
  window.addEventListener(cookieChangedEventType, callback)
  return () => window.removeEventListener(cookieChangedEventType, callback)
}
