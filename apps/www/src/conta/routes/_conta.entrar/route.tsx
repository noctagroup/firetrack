import { useQuery } from "@tanstack/react-query"

import { contaOptions } from "~conta/queries"

export default function ContaIndex() {
  const minhaConta = useQuery(contaOptions.minhaConta())

  return <pre>{JSON.stringify(minhaConta.data, null, 4)}</pre>
}
