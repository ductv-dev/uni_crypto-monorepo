import { Icons } from "@workspace/ui/components/icons"
export type MethodAddWalletType = {
  id: number
  title: string
  description: string
  icon: keyof typeof Icons
}

export const DataMethodsAddWallet: MethodAddWalletType[] = [
  {
    id: 1,
    title: "Tạo ví Keyless",
    description: "Tạo ví mới để bắt đầu",
    icon: "wallet2",
  },
  {
    id: 2,
    title: "Nhập ví",
    description: "Nhập ví để bắt đầu",
    icon: "import",
  },
]
