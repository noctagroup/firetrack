import * as React from "react"

export const useDebounced = <Fn extends (...args: Parameters<Fn>) => void>(
  fn: Fn,
  wait = 0
): ((...args: Parameters<Fn>) => void) => {
  const timeoutId = React.useRef<number | null>(null)

  const debouncedFn = React.useCallback(
    (...args: Parameters<Fn>) => {
      if (timeoutId.current != null) {
        window.clearTimeout(timeoutId.current)
      }

      timeoutId.current = window.setTimeout(() => {
        fn(...args)
      }, wait)
    },
    [fn, wait]
  )

  React.useEffect(() => {
    return () => {
      if (timeoutId.current != null) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [])

  return debouncedFn
}
