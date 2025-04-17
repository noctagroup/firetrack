import type { CookieStorage, CookieStorageEvent } from "~shared/hooks/use-storage"

export {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyFn = (...args: any[]) => any

  type Nullable<T> = T | null | undefined

  type ValidJSON = string | number | boolean | null | Record<PropertyKey, unknown> | Array<unknown>

  interface WindowEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [CookieStorage.eventType]: CookieStorageEvent<any>
  }
}
