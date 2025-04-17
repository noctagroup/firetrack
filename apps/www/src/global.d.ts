export {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyFn = (...args: any[]) => any

  type Nullable<T> = T | null | undefined
}
