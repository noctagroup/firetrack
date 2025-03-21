import { ContaServices } from "~conta/services"
import type { Keyring, MutationsKeyring, OptionsKeyring } from "~shared/lib/query/types"
import { mutationOptions, queryOptions } from "~shared/lib/query/utils"

export const contaKeys = {
  all: () => ["conta"],
  minhaConta: () => [...contaKeys.all(), "minha-conta"],
} as const satisfies Keyring

export const contaOptions = {
  minhaConta: () =>
    queryOptions({
      queryKey: contaKeys.minhaConta(),
      queryFn: ContaServices.getConta,
    }),
} as const satisfies OptionsKeyring

export const contaMutations = {
  sair: () =>
    mutationOptions({
      mutationFn: ContaServices.sair,
    }),
} as const satisfies MutationsKeyring
