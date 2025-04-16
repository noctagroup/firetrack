import { ContaServices } from "~conta/services"
import type { Keyring, MutationsKeyring, OptionsKeyring } from "~shared/lib/query/types"
import { mutationOptions, queryOptions } from "~shared/lib/query/utils"

export const contaKeys = {
  all: () => ["conta"],
  conta: () => [...contaKeys.all(), "logada"],
} as const satisfies Keyring

export const contaOptions = {
  conta: () =>
    queryOptions({
      queryKey: contaKeys.conta(),
      queryFn: ContaServices.conta,
    }),
} as const satisfies OptionsKeyring

export const contaMutationKeys = {
  sair: () => [...contaKeys.all(), "sair"],
  entrar: () => [...contaKeys.all(), "entrar"],
  cadastrar: () => [...contaKeys.all(), "cadastrar"],
} as const satisfies Keyring

export const contaMutations = {
  sair: () =>
    mutationOptions({
      mutationKey: contaMutationKeys.sair(),
      mutationFn: ContaServices.sair,
    }),
  entrar: () =>
    mutationOptions({
      mutationKey: contaMutationKeys.entrar(),
      mutationFn: ContaServices.entrar,
    }),
  cadastrar: () =>
    mutationOptions({
      mutationKey: contaMutationKeys.cadastrar(),
      mutationFn: ContaServices.cadastrar,
    }),
} as const satisfies MutationsKeyring
