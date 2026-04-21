"use client"

export type TUserPagination = {
  limit: number
  offset: number
}

export type TUserFilter = {
  status: string
  country: string
}

export const DEFAULT_USER_FILTER: TUserFilter = {
  status: "",
  country: "",
}
