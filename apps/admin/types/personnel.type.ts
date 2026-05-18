export interface TPersonnel {
  id: string
  fullName: string
  email: string
  roleId: string
  role: string
  status: "active" | "inactive" | "blocked"
  createdAt: string
  updatedAt: string
  phoneNumber?: string | null
}

export type TPersonnelResponse = {
  data: TPersonnel[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
