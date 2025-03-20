import { Outlet, redirect } from "react-router"

import { contaOptions } from "~conta/queries"
import { queryClient } from "~shared/lib/query/client"

export async function clientLoader() {
  try {
    const minhaConta = await queryClient.ensureQueryData(contaOptions.minhaConta())

    if (minhaConta.is_authenticated) {
      return redirect("/fenomeno")
    }
  } catch {
    // noop
  }
}

export default function Conta() {
  return <Outlet />
}
