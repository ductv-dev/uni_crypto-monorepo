import { redirect } from "next/navigation"

export default function LegacyUserSettingPage() {
  return redirect("/user/settings")
}
