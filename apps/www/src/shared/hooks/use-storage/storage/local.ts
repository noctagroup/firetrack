import type { Storage, Unsubscribe } from "~shared/hooks/use-storage/storage"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LocalStorage<TStorageDecoded = any, TStorageEncoded extends string = string>
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

export const localStorage = new LocalStorage()
