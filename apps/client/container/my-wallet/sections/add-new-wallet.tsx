import { useIsMobile } from "@/hooks/use-is-mobile"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { CircleOff, Wallet2 } from "lucide-react"
import { ListAddWallet } from "../components/add-wallet"

export const AddNewWallet = () => {
  const isMobile = useIsMobile()
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-2.5">
          <span className="flex w-fit items-center justify-center rounded-2xl border-t border-red-500 bg-red-500/5 p-4 shadow-sm shadow-red-500/50">
            <CircleOff className="text-red-500" />
          </span>
          <p className="text-sm text-muted-foreground">
            Hiện tại bạn chưa có ví tiền
          </p>

          <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger>
              <Button size={"lg"}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Wallet2 />
                  <span>Thêm ví để bắt đầu</span>
                </div>
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
        </CardContent>
      </Card>
    </div>
  )
}
