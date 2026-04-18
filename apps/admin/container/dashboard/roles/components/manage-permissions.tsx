"use client"

import {
  useRolePermissions,
  PERMISSION_GROUPS,
} from "@/hooks/roles/use-role-permissions"
import { TRole } from "@/types/role.type"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { toast } from "@workspace/ui/index"
import { ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useUpdatePermissions } from "@/hooks/roles/use-update-permissions"

export const ManagePermissions = ({ role }: { role: TRole }) => {
  const [open, setOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const { data, isLoading } = useRolePermissions(role.id, open)
  const { mutate: updatePermissions, isPending } = useUpdatePermissions(role.id)

  useEffect(() => {
    if (!data) return
    setSelectedPermissions(data.permissions)
  }, [data])

  const togglePermission = (permission: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        return prev.includes(permission) ? prev : [...prev, permission]
      }

      return prev.filter((item) => item !== permission)
    })
  }

  const handleSave = () => {
    updatePermissions(selectedPermissions, {
      onSuccess: () => {
        toast.success("Cập nhật phân quyền thành công!")
        setOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật")
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Phân Quyền
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-[600px] flex-col px-6 sm:w-[1200px]">
        <SheetHeader>
          <SheetTitle>Cấu hình Phân Quyền</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Thiết lập quyền hạn cho vai trò{" "}
            <span className="font-semibold text-foreground">{role.name}</span>.
          </p>
        </SheetHeader>

        <ScrollArea className="-mx-6 mt-6 flex-1 px-6">
          <div className="space-y-6 pb-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((__, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center space-x-2"
                        >
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              : PERMISSION_GROUPS.map((group) => (
                  <div key={group.module} className="space-y-3">
                    <h4 className="border-b pb-2 text-sm font-semibold">
                      {group.module}
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.actions.map((action) => (
                        <div
                          key={action}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`perm-${action.replace(/\s+/g, "-").toLowerCase()}`}
                            checked={selectedPermissions.includes(action)}
                            onCheckedChange={(checked) =>
                              togglePermission(action, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`perm-${action.replace(/\s+/g, "-").toLowerCase()}`}
                            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {action}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-auto border-t pt-6">
          <SheetClose asChild>
            <Button variant="outline">Hủy</Button>
          </SheetClose>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu Phân Quyền"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
