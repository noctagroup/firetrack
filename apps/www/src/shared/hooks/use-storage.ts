import Cookie from "js-cookie"
import * as React from "react"

import { isNil } from "~shared/utils/is"

type Unsubscribe = () => void

export interface Storage<TStorageValue> {
  getItem: (key: string) => Nullable<TStorageValue>
  setItem: (key: string, newValue: Nullable<TStorageValue>) => void
  removeItem: (key: string) => void
  subscribe: (callback: AnyFn) => Unsubscribe
  dispatchEvent: (key: string, newValue: Nullable<TStorageValue>) => void
}

export class CookieStorage<TStorageValue extends string> implements Storage<TStorageValue> {
  #eventType: string = "cookiechanged"

  getItem(key: string): Nullable<TStorageValue> {
    return Cookie.get(key) as Nullable<TStorageValue>
  }

  setItem(key: string, newValue: Nullable<TStorageValue>): void {
    Cookie.set(key, JSON.stringify(newValue))
    this.dispatchEvent(key, newValue)
  }

  removeItem(key: string): void {
    Cookie.remove(key)
    this.dispatchEvent(key, undefined)
  }

  dispatchEvent(key: string, newValue: Nullable<TStorageValue>): void {
    window.dispatchEvent(new CustomEvent(this.#eventType, { detail: { key, newValue } }))
  }

  subscribe(callback: AnyFn): Unsubscribe {
    window.addEventListener(this.#eventType, callback)
    return () => window.removeEventListener(this.#eventType, callback)
  }
}

export function useStorage<TStorageValue extends string>(
  storageKey: string,
  storageInitialValue: TStorageValue,
  storage: Storage<TStorageValue>
): [TStorageValue, React.Dispatch<React.SetStateAction<TStorageValue>>] {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => storage.subscribe(onStoreChange),
    [storage]
  )
  const getServerSnapshot = React.useCallback<() => undefined>(() => undefined, [])
  const getSnapshot = React.useCallback<() => Nullable<TStorageValue>>(
    () => storage.getItem(storageKey),
    [storage, storageKey]
  )

  const store = React.useSyncExternalStore<Nullable<TStorageValue>>(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<TStorageValue>>>(
    (_nextState) => {
      const nextState =
        typeof _nextState === "function"
          ? (_nextState as (value: TStorageValue) => TStorageValue)(JSON.parse(store!))
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
    const value = storage.getItem(storageKey)

    if (isNil(value) && typeof storageInitialValue !== "undefined") {
      storage.setItem(storageKey, storageInitialValue)
    }
  }, [storage, store, storageKey, storageInitialValue])

  return [store ? JSON.parse(store) : storageInitialValue, setState]
}
