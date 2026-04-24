import { redirect } from "next/navigation"

export default function LegacyWithdrawalPage() {
  return redirect("/transactions/withdrawals")
}
