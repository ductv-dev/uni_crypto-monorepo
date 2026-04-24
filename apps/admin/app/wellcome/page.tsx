import { redirect } from "next/navigation"

export default function LegacyWellcomePage() {
  return redirect("/welcome")
}
