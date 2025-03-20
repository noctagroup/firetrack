import * as React from "react"

export function useResizeObserver(id: string, callback: ResizeObserverCallback): void {
  React.useEffect(() => {
    const element = document.getElementById(id)!
    const observer = new ResizeObserver(callback)
    observer.observe(element)

    return () => observer.disconnect()
  }, [callback, id])
}
