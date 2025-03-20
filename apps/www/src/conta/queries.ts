import { ContaServices } from "~conta/services"
import type { Keyring, OptionsKeyring } from "~shared/lib/query"
import { queryOptions } from "~shared/lib/query"

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
