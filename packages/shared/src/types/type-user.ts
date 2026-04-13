import { TWallet } from "./type-wallet"

export type TUser = {
  name: string
  id: string
  email: string
  phone?: string
  avatar?: string
  wallet?: TWallet[]
}
