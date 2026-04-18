"use client"

import { TPersonnel } from "@/types/personnel.type"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Activity, Calendar, Dot, Eye, Mail, ShieldCheck } from "lucide-react"

export const PersonnelDetailView = ({
  personnel,
}: {
  personnel: TPersonnel
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-[600px] flex-col px-6 sm:w-[1200px]">
        <SheetHeader>
          <SheetTitle>Chi tiết Quản Trị Viên</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {personnel.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{personnel.fullName}</h3>
              <p className="text-sm text-muted-foreground">{personnel.id}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" /> Email
              </span>
              <span className="text-sm font-medium">{personnel.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4" /> Vai trò
              </span>
              <span className="text-sm font-medium">{personnel.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Activity className="mr-2 h-4 w-4" /> Trạng thái
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  personnel.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : personnel.status === "inactive"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                <Dot className="mr-1 h-3 w-3" />{" "}
                {personnel.status.charAt(0).toUpperCase() +
                  personnel.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" /> Ngày tham gia
              </span>
              <span className="text-sm font-medium">
                {personnel.joinedDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Activity className="mr-2 h-4 w-4" /> Hoạt động gần nhất
              </span>
              <span className="text-sm font-medium">
                {personnel.lastActive}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Nhật ký hoạt động (Demo)</h4>
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Dot className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      Đăng nhập thành công
                    </p>
                    <p className="text-xs">
                      {personnel.lastActive} - 192.168.1.1
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Dot className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      Thay đổi cài đặt hệ thống
                    </p>
                    <p className="text-xs">2 ngày trước</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
