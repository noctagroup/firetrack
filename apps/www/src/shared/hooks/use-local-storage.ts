import * as React from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const store = React.useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange)
      return () => window.removeEventListener("storage", onStoreChange)
    },
    () => getLocalStorageItem(key)
  )

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (_nextState) => {
      try {
        const nextState =
          typeof _nextState === "function"
            ? (_nextState as (value: T) => T)(JSON.parse(store!))
            : _nextState

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key)
        } else {
          setLocalStorageItem(key, nextState)
        }
      } catch (e) {
        console.warn(e)
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
