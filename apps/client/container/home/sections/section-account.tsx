import { ButtonNav } from "@/components/custom/button/button-navigation"
import { CardSetting } from "@/components/custom/cards/card-setting"
import { shortenHex } from "@/lib/utils/utils"
import { TUser } from "@workspace/shared/types"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { toast } from "@workspace/ui/index"
import { Copy, Settings, User2, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
  data: TUser
}

export const SectionAccount: React.FC<Props> = ({ data }) => {
  const route = useRouter()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.id)
      toast.success("Đã sao chép vào clipboard!", {
        duration: 2000,
        className: "",
        icon: <Copy size={16} strokeWidth={2} className="text-green-500" />,
      })
    } catch {
      toast.error("Failed to copy to clipboard!")
    }
  }

  const shortID = shortenHex(data.id)
  return (
    <div className="flex items-center border-b border-border px-2.5 py-4">
      <div className="flex flex-1 gap-1">
        <Drawer>
          <DrawerTrigger>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              {data.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={data.avatar}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User2 size={20} className="text-primary" />
              )}
            </div>
          </DrawerTrigger>
          <DrawerContent className="px-2.5">
            {/* Account */}
            <div className="mt-5 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                {data.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={data.avatar}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User2 size={20} className="text-primary" />
                )}
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-foreground/60"> {data.name}</p>
                <div className="flex gap-1">
                  <p className="text-xs text-foreground/60">{shortID}</p>
                  <button onClick={() => handleCopy()} className="">
                    <Copy size={16} strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <CardSetting
                onClick={() => route.push("/user/my-wallet")}
                title="My Wallet"
                icon={<Wallet strokeWidth={3} size={20} />}
              />
              <CardSetting
                title="Account"
                onClick={() => route.push("/user/account")}
                icon={<User2 strokeWidth={3} size={20} />}
              />
            </div>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <div className="flex flex-col">
          <p className="font-semibold text-foreground/60"> {data.name}</p>
          <div className="flex gap-1">
            <p className="text-xs text-foreground/60">{shortID}</p>
            <button onClick={() => handleCopy()} className="">
              <Copy size={16} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
      <ButtonNav onClick={() => route.push("/user/setting")}>
        <Settings size={16} strokeWidth={2} className="text-foreground/60" />
      </ButtonNav>
    </div>
  )
}
