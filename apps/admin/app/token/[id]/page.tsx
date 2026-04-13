"use client"
import { TokenInfor } from "@/container/token/page"
import { useParams } from "next/navigation"

export default function TokenInforPage() {
  const params = useParams()
  const id = String(params.id)

  return <TokenInfor symbol={id} />
}
