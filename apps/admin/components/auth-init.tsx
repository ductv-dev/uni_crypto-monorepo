"use client"

import { useMe } from "@/hooks/auth/use-me"

export function AuthInit() {
  useMe()
  return null
}
