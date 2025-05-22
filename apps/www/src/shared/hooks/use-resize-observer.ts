import * as React from "react"

export function useResizeObserver(
  elementId: string,
  observerCallback: ResizeObserverCallback
): ResizeObserver | undefined {
  const resizeObserver = React.useRef<ResizeObserver>(undefined)

  React.useEffect(() => {
    const element = document.getElementById(elementId)

    if (!element) return undefined

    resizeObserver.current = new ResizeObserver(observerCallback)
    resizeObserver.current.observe(element)

    return () => resizeObserver.current!.disconnect()
  }, [observerCallback, elementId])

  return resizeObserver.current
}
