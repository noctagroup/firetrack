import type { DefaultError, UseMutationOptions } from "@tanstack/react-query"
import { queryOptions } from "@tanstack/react-query"

function mutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return options
}

export { mutationOptions, queryOptions }
