export interface TPersonnel {
  id: string
  fullName: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  lastActive: string
  joinedDate: string
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
