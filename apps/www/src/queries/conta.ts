import type { Keyring, OptionsKeyring } from "~/lib/query"
import { queryOptions } from "~/lib/query"
import { ContaServices } from "~/services/conta"

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
