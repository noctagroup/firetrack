import Cookie from "js-cookie"
import * as React from "react"

import { isNil } from "~shared/utils/is"

type Unsubscribe = () => void

export interface Storage<TStorageDecoded, TStorageEncoded> {
  encode: (value: Nullable<TStorageDecoded>) => Nullable<TStorageEncoded>
  decode: (value: Nullable<TStorageEncoded>) => Nullable<TStorageDecoded>
  subscribe: (key: string, callback: AnyFn) => Unsubscribe
  removeItem: (key: string) => void
  getItem: (key: string) => Nullable<TStorageDecoded>
  setItem: (key: string, newValue: Nullable<TStorageDecoded>) => void
  dispatchEvent: (key: string, newValue: Nullable<TStorageDecoded>) => void
}

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

export class LocalStorage<TStorageDecoded, TStorageEncoded extends string = string>
  implements Storage<TStorageDecoded, TStorageEncoded>
{
  static readonly eventType = "storage" as const

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
    const listener = (event: StorageEvent) => {
      if (event.key === key) {
        callback()
      }
    }

    window.addEventListener(LocalStorage.eventType, listener)
    return () => window.removeEventListener(LocalStorage.eventType, listener)
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key)
    this.dispatchEvent(key, undefined)
  }

  getItem(key: string): Nullable<TStorageDecoded> {
    const item = window.localStorage.getItem(key)
    const decoded = this.decode(item as Nullable<TStorageEncoded>)

    return decoded
  }

  setItem(key: string, newValue: Nullable<TStorageDecoded>): void {
    const encoded = this.encode(newValue)
    window.localStorage.setItem(key, encoded!)
    this.dispatchEvent(key, newValue)
  }

  dispatchEvent(key: string, newValue: Nullable<TStorageDecoded>): void {
    window.dispatchEvent(
      new StorageEvent(LocalStorage.eventType, {
        key: key,
        newValue: newValue?.toString?.(),
      })
    )
  }
}

export function useStorage<TStorageDecoded, TStorageEncoded extends string = string>(
  storageKey: string,
  storageInitialValue: TStorageDecoded,
  storage: Storage<TStorageDecoded, TStorageEncoded>
): [TStorageDecoded, React.Dispatch<React.SetStateAction<TStorageDecoded>>] {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => storage.subscribe(storageKey, onStoreChange),
    [storageKey, storage]
  )
  const getServerSnapshot = React.useCallback<() => undefined>(() => undefined, [])
  const getSnapshot = React.useCallback<() => Nullable<TStorageDecoded>>(
    () => storage.getItem(storageKey),
    [storage, storageKey]
  )

  const store = React.useSyncExternalStore<Nullable<TStorageDecoded>>(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<TStorageDecoded>>>(
    (_nextState) => {
      const nextState =
        typeof _nextState === "function"
          ? (_nextState as (value: Nullable<TStorageDecoded>) => Nullable<TStorageDecoded>)(store)
          : _nextState

      if (isNil(nextState)) {
        storage.removeItem(storageKey)
      } else {
        storage.setItem(storageKey, nextState)
      }
    },
    [storage, store, storageKey]
  )

  React.useEffect(() => {
    if (isNil(storage.getItem(storageKey)) && !isNil(storageInitialValue)) {
      storage.setItem(storageKey, storageInitialValue)
    }
  }, [storage, store, storageKey, storageInitialValue])

  return [store ?? storageInitialValue, setState]
}
