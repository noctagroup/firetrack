import * as React from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = React.useCallback(() => getLocalStorageItem(key), [key])

  const store = React.useSyncExternalStore(useLocalStorageSubscribe, getSnapshot)

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (_nextState) => {
      const nextState =
        typeof _nextState === "function"
          ? (_nextState as (value: T) => T)(JSON.parse(store!))
          : _nextState

      if (nextState === undefined || nextState === null) {
        removeLocalStorageItem(key)
      } else {
        setLocalStorageItem(key, nextState)
      }
    },
    [key, store]
  )

  React.useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== "undefined") {
      setLocalStorageItem(key, initialValue)
    }
  }, [key, initialValue])

  return [store ? JSON.parse(store) : initialValue, setState]
}

function dispatchStorageEvent(key: string, newValue?: string | null) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }))
}

function getLocalStorageItem(key: string) {
  return window.localStorage.getItem(key)
}

function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key)
  dispatchStorageEvent(key, null)
}

function setLocalStorageItem<T>(key: string, value: T) {
  const stringifiedValue = JSON.stringify(value)
  window.localStorage.setItem(key, stringifiedValue)
  dispatchStorageEvent(key, stringifiedValue)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useLocalStorageSubscribe<Fn extends (...args: any[]) => any>(callback: Fn) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}
