import { useIsMobile } from "@/hooks/use-is-mobile"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ListAddWallet } from "../components/add-wallet"

export const HeaderMyWallet = () => {
  const isMobile = useIsMobile()
  const route = useRouter()
  return (
    <div className="flex items-center justify-between px-2.5 py-5">
      <div className="lg:hidden">
        <Button onClick={() => route.back()} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div>
        <h1 className="text-lg font-semibold">My Wallet</h1>
      </div>
      <div>
        <Drawer direction={isMobile ? "bottom" : "right"}>
          <DrawerTrigger>
            <Button size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Thêm ví</DrawerTitle>
            </DrawerHeader>
            <ListAddWallet />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="mx-auto max-w-sm">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
