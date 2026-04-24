import { redirect } from "next/navigation"

export default function LegacyOrderBookPage() {
  return redirect("/transactions/order-book")
}
