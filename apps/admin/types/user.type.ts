export type TUser = {
  id: string
  email: string
  username: string
  phone: string
  avatar: string
  status: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isTwoFactorEnabled: boolean
  kycStatus: string
  dateOfBirth: string
  gender: string
  country: string
  city: string
  address: string
  zipCode: string
  id_type: string
  id_number: string
  createdAt: string
  updatedAt: string
}

export type TUserResponse = {
  data: TUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TUserWallet = {
  id: string
  userId: string
  asset: string
  network: string
  walletAddress: string
  availableBalance: string
  lockedBalance: string
  totalBalance: string
  status: string
}
