import Cookie from "js-cookie"

import type { Storage, Unsubscribe } from "~shared/hooks/use-storage/storage"
import { isNil } from "~shared/utils/is"

export type CookieStorageEvent<T> = CustomEvent<CookieStorageEventDetails<T>>

export type CookieStorageEventDetails<T> = {
  key: string
  newValue: Nullable<T>
}

export class CookieStorage<TStorageDecoded, TStorageEncoded extends string = string>
  implements Storage<TStorageDecoded, TStorageEncoded>
{
  static readonly eventType = "cookiechanged" as const

  encode(value: Nullable<TStorageDecoded>): Nullable<TStorageEncoded> {
    try {
      return JSON.stringify(value) as TStorageEncoded
    } catch {
      return undefined
    }
  }

  decode(value: Nullable<TStorageEncoded>): Nullable<TStorageDecoded> {
    try {
      return JSON.parse(value!) as TStorageDecoded
    } catch {
      return undefined
    }
  }

  subscribe(key: string, callback: AnyFn): Unsubscribe {
    const listener = (event: CookieStorageEvent<TStorageDecoded>) => {
      if (!isNil(event.detail?.key) && event.detail.key === key) {
        callback()
      }
    }

    window.addEventListener(CookieStorage.eventType, listener)
    return () => window.removeEventListener(CookieStorage.eventType, listener)
  }

  removeItem(key: string): void {
    Cookie.remove(key)
    this.dispatchEvent(key, undefined)
  }

  getItem(key: string): Nullable<TStorageDecoded> {
    const cookie = Cookie.get(key)
    const decoded = this.decode(cookie as Nullable<TStorageEncoded>)

    return decoded
  }

  setItem(key: string, newValue: Nullable<TStorageDecoded>): void {
    const encoded = this.encode(newValue)
    Cookie.set(key, encoded!)
    this.dispatchEvent(key, newValue)
  }

  dispatchEvent(key: string, newValue: Nullable<TStorageDecoded>): void {
    window.dispatchEvent(
      new CustomEvent<CookieStorageEventDetails<TStorageDecoded>>(CookieStorage.eventType, {
        detail: {
          key: key,
          newValue: newValue,
        },
      })
    )
  }
}
