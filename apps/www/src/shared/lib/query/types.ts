/* eslint-disable @typescript-eslint/no-explicit-any */
type Keyring = Record<string, (...args: any) => any>

type OptionsKeyring = Record<string, (...args: any) => any>

export type { Keyring, OptionsKeyring }
