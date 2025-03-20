import * as React from "react"

function dispatchStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }))
}

const getLocalStorageItem = (key) => {
  return window.localStorage.getItem(key)
}

const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key)
  dispatchStorageEvent(key, null)
}

const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value)
  window.localStorage.setItem(key, stringifiedValue)
  dispatchStorageEvent(key, stringifiedValue)
}

const useLocalStorageSubscribe = (callback) => {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

export function useLocalStorage(key, initialValue) {
  const getSnapshot = () => getLocalStorageItem(key)

  const store = React.useSyncExternalStore(useLocalStorageSubscribe, getSnapshot)

  const setState = React.useCallback(
    (v) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v

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
