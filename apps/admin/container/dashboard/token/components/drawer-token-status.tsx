import { useUpdateTokenStatus } from "@/hooks/token/use-update-token-status"
import { TToken } from "@workspace/shared/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import { Switch } from "@workspace/ui/components/switch"

type TDrawerTokenStatus = {
  token: TToken
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DrawerTokenStatus: React.FC<TDrawerTokenStatus> = ({
  token,
  open,
  onOpenChange,
}) => {
  const updateTokenStatusMutation = useUpdateTokenStatus()
  const isUpdatingStatus = updateTokenStatusMutation.isPending

  const handleStatusChange = (
    key: "isDepositEnabled" | "isWithdrawEnabled" | "isTradingEnabled"
  ) => {
    return (checked: boolean) => {
      void updateTokenStatusMutation.mutateAsync({
        address: token.address,
        key,
        value: checked,
      })
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quản lý token</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-6">
          <div className="flex gap-2.5">
            <Avatar className="h-9 w-9 shrink-0 bg-white">
              <AvatarImage src={token.logoURI} alt={`${token.name} logo`} />
              <AvatarFallback className="text-xs">
                {token.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-foreground">{token.name}</p>
              <p className="text-xs text-muted-foreground">{token.symbol}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center space-x-2">
            <Switch
              checked={token.isDepositEnabled ?? false}
              disabled={isUpdatingStatus}
              id={`deposit-${token.address}`}
              onCheckedChange={handleStatusChange("isDepositEnabled")}
            />
            <Label htmlFor={`deposit-${token.address}`}>Deposit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={token.isWithdrawEnabled ?? false}
              disabled={isUpdatingStatus}
              id={`withdraw-${token.address}`}
              onCheckedChange={handleStatusChange("isWithdrawEnabled")}
            />
            <Label htmlFor={`withdraw-${token.address}`}>Withdraw</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={token.isTradingEnabled ?? false}
              disabled={isUpdatingStatus}
              id={`trading-${token.address}`}
              onCheckedChange={handleStatusChange("isTradingEnabled")}
            />
            <Label htmlFor={`trading-${token.address}`}>Trading</Label>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
