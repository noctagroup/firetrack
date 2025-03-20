import * as React from "react"

export const useDebounced = <Fn extends (...args: Parameters<Fn>) => void>(
  fn: Fn,
  wait = 0
): ((...args: Parameters<Fn>) => void) => {
  const rafId = React.useRef(0)

  const render = React.useCallback(
    (...args: Parameters<Fn>) => {
      cancelAnimationFrame(rafId.current)

      const timeStart = performance.now()

      const renderFrame = (timeNow: number) => {
        if (timeNow - timeStart < wait) {
          rafId.current = requestAnimationFrame(renderFrame)
          return
        }

        fn(...args)
      }

      rafId.current = requestAnimationFrame(renderFrame)
    },
    [fn, wait]
  )

  React.useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  return render
}
