import { Button } from "@workspace/ui/components/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export const SectionHeader = () => {
  const route = useRouter()
  return (
    <div className="fixed top-0 z-30 w-full bg-background md:hidden">
      <div className="flex w-full border-b border-border p-2.5">
        <Button variant={"ghost"} onClick={() => route.back()}>
          <ChevronLeft />
        </Button>
      </div>
    </div>
  )
}
