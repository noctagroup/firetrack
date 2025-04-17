export type Unsubscribe = () => void

export interface Storage<TStorageDecoded, TStorageEncoded> {
  encode: (value: Nullable<TStorageDecoded>) => Nullable<TStorageEncoded>
  decode: (value: Nullable<TStorageEncoded>) => Nullable<TStorageDecoded>
  subscribe: (key: string, callback: AnyFn) => Unsubscribe
  removeItem: (key: string) => void
  getItem: (key: string) => Nullable<TStorageDecoded>
  setItem: (key: string, newValue: Nullable<TStorageDecoded>) => void
  dispatchEvent: (key: string, newValue: Nullable<TStorageDecoded>) => void
}
