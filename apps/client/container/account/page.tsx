"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { Input } from "@workspace/ui/components/input"

import { useAccountProfile } from "@/hooks/use-account-profile"

import { AccountCompletion } from "./sections/account-completion"
import { AccountHeader } from "./sections/account-header"
import { AccountInfo } from "./sections/account-info"
import { AccountManagement } from "./sections/account-management"
import { AccountSecurity } from "./sections/account-security"
import { AccountSkeleton } from "./sections/account-skeleton"
import { AccountStats } from "./sections/account-stats"

export const Account = () => {
  const {
    user,
    name,
    shortID,
    drawerOpen,
    walletCount,
    tokenCount,
    totalBalance,
    profileStatus,
    completedStatusCount,
    profileCompletion,
    isLoading,
    isUpdating,
    onNameChange,
    onDrawerOpenChange,
    onOpenNameDrawer,
    onCopy,
    onSubmitName,
    onGoToWallets,
    onGoToSettings,
    onLogout,
  } = useAccountProfile()

  if (isLoading) {
    return <AccountSkeleton />
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] pb-20 lg:pb-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-6">
          <AccountHeader
            user={user}
            shortID={shortID}
            completedStatusCount={completedStatusCount}
            totalStatusCount={profileStatus.length}
            onCopy={onCopy}
            onOpenNameDrawer={onOpenNameDrawer}
          />

          <AccountStats
            totalBalance={totalBalance}
            walletCount={walletCount}
            tokenCount={tokenCount}
          />

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <AccountInfo user={user} onCopy={onCopy} />
            <AccountCompletion
              profileCompletion={profileCompletion}
              completedStatusCount={completedStatusCount}
              profileStatus={profileStatus}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <AccountManagement
              onGoToWallets={onGoToWallets}
              onGoToSettings={onGoToSettings}
              onOpenNameDrawer={onOpenNameDrawer}
            />
            <AccountSecurity
              onGoToSettings={onGoToSettings}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={onDrawerOpenChange}>
        <DrawerContent className="px-3 sm:px-4">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle>Chỉnh sửa tên hiển thị</DrawerTitle>
            <DrawerDescription>
              Tên mới sẽ xuất hiện trên hồ sơ và các khu vực tài khoản trong ứng
              dụng.
            </DrawerDescription>
          </DrawerHeader>
          <div className="pb-4">
            <Input
              value={name}
              maxLength={32}
              placeholder="Nhập tên mới"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <DrawerFooter className="px-0">
            <Button
              size="lg"
              onClick={onSubmitName}
              disabled={isUpdating || !name.trim() || name.trim() === user.name}
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <DrawerClose asChild>
              <Button size="lg" variant="outline">
                Hủy
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
