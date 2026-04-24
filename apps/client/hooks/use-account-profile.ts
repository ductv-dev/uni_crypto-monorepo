"use client"

import { useUpdateUser, useUserData } from "@/hooks/use-user-data"
import { shortenHex } from "@/lib/utils/utils"
import { useUser as useUserStore } from "@/store/user-store"
import { TUser } from "@workspace/shared/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@workspace/ui/index"

export type AccountProfileStatus = {
  label: string
  description: string
  complete: boolean
}

export type UseAccountProfileResult = {
  user: TUser
  name: string
  shortID: string
  drawerOpen: boolean
  walletCount: number
  tokenCount: number
  totalBalance: number
  profileStatus: AccountProfileStatus[]
  completedStatusCount: number
  profileCompletion: number
  isLoading: boolean
  isUpdating: boolean
  onNameChange: (value: string) => void
  onDrawerOpenChange: (open: boolean) => void
  onOpenNameDrawer: () => void
  onCopy: () => Promise<void>
  onSubmitName: () => void
  onGoToWallets: () => void
  onGoToSettings: () => void
  onLogout: () => void
}

const buildProfileStatus = (user: TUser): AccountProfileStatus[] => [
  {
    label: "Email đăng nhập",
    description: user.email || "Chưa cập nhật email",
    complete: Boolean(user.email),
  },
  {
    label: "Số điện thoại",
    description: user.phone || "Thêm số điện thoại để tăng độ tin cậy",
    complete: Boolean(user.phone),
  },
  {
    label: "Ảnh đại diện",
    description: user.avatar
      ? "Avatar đã được thiết lập"
      : "Thêm avatar để hồ sơ rõ ràng hơn",
    complete: Boolean(user.avatar),
  },
]

export const useAccountProfile = (): UseAccountProfileResult => {
  const router = useRouter()
  const storedUser = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  const userQuery = useUserData()
  const updateUserMutation = useUpdateUser()

  const user = userQuery.data ?? storedUser
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [name, setName] = useState(user.name)

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data)
    }
  }, [setUser, userQuery.data])

  const wallets = user.wallet ?? []
  const walletCount = wallets.length
  const tokenCount = wallets.reduce(
    (total, wallet) => total + wallet.tokens.length,
    0
  )
  const totalBalance = wallets.reduce(
    (total, wallet) => total + wallet.balanceUSDT,
    0
  )
  const shortID = shortenHex(user.id)
  const profileStatus = buildProfileStatus(user)
  const completedStatusCount = profileStatus.filter(
    (item) => item.complete
  ).length
  const profileCompletion = Math.round(
    (completedStatusCount / profileStatus.length) * 100
  )

  const onDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)
    if (open) {
      setName(user.name)
    }
  }

  const onOpenNameDrawer = () => {
    setName(user.name)
    setDrawerOpen(true)
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast.success("Đã sao chép ID tài khoản", { duration: 2000 })
    } catch {
      toast.error("Không thể sao chép ID")
    }
  }

  const onSubmitName = () => {
    const nextName = name.trim()

    if (!nextName) {
      toast.error("Tên không được để trống")
      return
    }

    if (nextName === user.name) {
      setDrawerOpen(false)
      return
    }

    updateUserMutation.mutate(
      { name: nextName },
      {
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể cập nhật tên hiển thị"
          )
        },
        onSuccess: (updatedUser) => {
          setUser(updatedUser)
          setName(updatedUser.name)
          setDrawerOpen(false)
          toast.success("Đã cập nhật tên hiển thị")
        },
      }
    )
  }

  return {
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
    isLoading: userQuery.isLoading && !userQuery.data,
    isUpdating: updateUserMutation.isPending,
    onNameChange: setName,
    onDrawerOpenChange,
    onOpenNameDrawer,
    onCopy,
    onSubmitName,
    onGoToWallets: () => router.push("/user/my-wallet"),
    onGoToSettings: () => router.push("/user/setting"),
    onLogout: () => {
      toast.success("Đăng xuất thành công")
      router.push("/wellcome")
    },
  }
}
