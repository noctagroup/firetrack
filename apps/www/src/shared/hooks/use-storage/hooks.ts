import * as React from "react"

import type { Storage } from "~shared/hooks/use-storage/storage"
import { isNil } from "~shared/utils/is"

export function useStorage<TStorageDecoded, TStorageEncoded extends string = string>(
  storageKey: string,
  storageInitialValue: TStorageDecoded,
  storage: Storage<TStorageDecoded, TStorageEncoded>
): [TStorageDecoded, React.Dispatch<React.SetStateAction<Nullable<TStorageDecoded>>>] {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => storage.subscribe(storageKey, onStoreChange),
    [storageKey, storage]
  )

  const getServerSnapshot = React.useCallback(() => undefined, [])

  const getSnapshot = React.useCallback(() => storage.getItem(storageKey), [storage, storageKey])

  const store = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setState = React.useCallback<
    React.Dispatch<React.SetStateAction<Nullable<TStorageDecoded>>>
  >(
    (_nextState) => {
      const nextState = _nextState instanceof Function ? _nextState(store) : _nextState

      if (isNil(nextState)) {
        storage.removeItem(storageKey)
      } else {
        storage.setItem(storageKey, nextState)
      }
    },
    [storage, store, storageKey]
  )

  React.useEffect(() => {
    if (isNil(storage.getItem(storageKey)) && !isNil(storageInitialValue)) {
      storage.setItem(storageKey, storageInitialValue)
    }
  }, [storage, store, storageKey, storageInitialValue])

  return [store ?? storageInitialValue, setState]
}
