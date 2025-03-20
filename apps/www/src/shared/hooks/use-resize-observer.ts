import * as React from "react"

export function useResizeObserver(
  elementId: string,
  observerCallback: ResizeObserverCallback
): void {
  React.useEffect(() => {
    const element = document.getElementById(elementId)!
    const observer = new ResizeObserver(observerCallback)
    observer.observe(element)

    return () => observer.disconnect()
  }, [observerCallback, elementId])
}
