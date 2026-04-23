"use client"

import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useGetUserById } from "@/hooks/users/use-user-id"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { UserQuickEdit } from "../users/components/user-quick-edit"
import { DepositsHistory } from "./components/deposits-history"
import { OrdersBuyHistory } from "./components/orders-buy-history"
import { OrdersSellHistory } from "./components/orders-sell-history"
import { WithdrawalsHistory } from "./components/withdrawals-history"

type Props = {
  id: string
}

const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <div className="flex items-center gap-3 rounded-lg border border-transparent bg-muted/30 p-3 transition-all hover:border-border">
    <div className="rounded-md bg-background p-2 shadow-sm">
      <Icon className="size-4 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm font-medium">{value || "N/A"}</span>
    </div>
  </div>
)

export const UserDetails: React.FC<Props> = ({ id }) => {
  const { data, isLoading } = useGetUserById(id)

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "verified":
      case "confirmed":
      case "completed":
        return (
          <Badge className="flex items-center gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            <CheckCircle2 className="size-3" /> {status}
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
          >
            <Clock className="size-3" /> {status}
          </Badge>
        )
      case "inactive":
      case "rejected":
      case "failed":
      case "canceled":
        return (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
          >
            <XCircle className="size-3" /> {status}
          </Badge>
        )
      case "partially_filled":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          >
            <Clock className="size-3" /> Chờ khớp một phần
          </Badge>
        )
      case "filled":
        return (
          <Badge className="flex items-center gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            <CheckCircle2 className="size-3" /> Đã khớp
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="space-y-6 p-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="col-span-2 h-64 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </SidebarInset>
    )
  }

  const user = data?.info

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/users">Người dùng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết người dùng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết người dùng
            </h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý và xem thông tin chi tiết của {user?.username}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(user?.status || "")}
            {getStatusBadge(user?.kycStatus || "")}
            {user && (
              <div className="ml-2 border-l pl-2">
                <UserQuickEdit user={user} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-6">
              <div className="flex flex-col items-center text-center">
                <div className="group relative">
                  <Avatar className="size-28 border-4 border-background shadow-xl">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -right-1 -bottom-1 size-6 rounded-full border-2 border-background bg-emerald-500"
                    title="Online"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold">{user?.username}</h2>
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.email}
                </p>

                <div className="mt-6 grid w-full grid-cols-2 gap-2">
                  <div className="flex flex-col items-center rounded-lg border bg-background/50 p-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Email
                    </span>
                    <span
                      className={`mt-1 text-[10px] font-medium ${user?.isEmailVerified ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {user?.isEmailVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border bg-background/50 p-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      2FA
                    </span>
                    <span
                      className={`mt-1 text-[10px] font-medium ${user?.isTwoFactorEnabled ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {user?.isTwoFactorEnabled ? "Đã bật" : "Chưa bật"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Info Grid */}
          <Card className="border-none shadow-md lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="size-5 text-primary" /> Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow
                label="Số điện thoại"
                value={user?.phone || ""}
                icon={Phone}
              />
              <InfoRow
                label="Giới tính"
                value={user?.gender || ""}
                icon={UserIcon}
              />
              <InfoRow
                label="Ngày sinh"
                value={
                  user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : ""
                }
                icon={Calendar}
              />
              <InfoRow
                label="Quốc gia"
                value={user?.country || ""}
                icon={MapPin}
              />
              <InfoRow
                label="Địa chỉ"
                value={`${user?.address || ""}, ${user?.city || ""}`}
                icon={MapPin}
              />
              <InfoRow
                label="Mã bưu điện"
                value={user?.zipCode || ""}
                icon={MapPin}
              />
              <InfoRow
                label="Loại định danh"
                value={user?.id_type || ""}
                icon={ShieldCheck}
              />
              <InfoRow
                label="Số định danh"
                value={user?.id_number || ""}
                icon={ShieldCheck}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data?.wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className="border-none bg-background shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-bold">
                    {wallet.asset}
                  </Badge>
                  {getStatusBadge(wallet.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-tighter text-muted-foreground uppercase">
                    Tổng số dư
                  </p>
                  <p className="text-xl font-bold">
                    {wallet.totalBalance} {wallet.asset}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-[10px]">
                  <div>
                    <p className="font-bold text-muted-foreground uppercase">
                      Khả dụng
                    </p>
                    <p className="font-semibold">{wallet.availableBalance}</p>
                  </div>
                  <div>
                    <p className="font-bold text-muted-foreground uppercase">
                      Đóng băng
                    </p>
                    <p className="font-semibold">{wallet.lockedBalance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <WithdrawalsHistory
          data={data?.transactions.withdrawal || []}
          isLoading={isLoading}
        />

        <DepositsHistory
          data={data?.transactions.deposit || []}
          isLoading={isLoading}
        />

        <OrdersBuyHistory
          data={data?.transactions.buy || []}
          isLoading={isLoading}
        />

        <OrdersSellHistory
          data={data?.transactions.sell || []}
          isLoading={isLoading}
        />
      </div>
    </SidebarInset>
  )
}
