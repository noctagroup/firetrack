/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultError, UseMutationOptions } from "@tanstack/react-query"
import { QueryClient, queryOptions } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5 /* 5s */,
    },
  },
})

function mutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return options
}

type Keyring = Record<string, (...args: any) => any>

type OptionsKeyring = Record<string, (...args: any) => any>

type MutationsKeyring = Record<string, (...args: any) => any>

export { mutationOptions, queryClient, queryOptions }
export type { Keyring, MutationsKeyring, OptionsKeyring }
