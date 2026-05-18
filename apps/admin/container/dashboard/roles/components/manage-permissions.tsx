"use client"

import { useRolePermissions } from "@/hooks/roles/use-role-permissions"
import { TRole } from "@/types/role.type"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
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

  const togglePermission = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        return prev.includes(permissionId) ? prev : [...prev, permissionId]
      }

      return prev.filter((item) => item !== permissionId)
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
      <SheetContent className="h-full w-[600px] overflow-y-auto px-6 sm:w-[1200px]">
        <div className="flex min-h-full flex-col py-6">
          <SheetHeader>
            <SheetTitle>Cấu hình Phân Quyền</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Thiết lập quyền hạn cho vai trò{" "}
              <span className="font-semibold text-foreground">{role.name}</span>
              .
            </p>
          </SheetHeader>

          <div className="mt-6 flex-1 space-y-6 pb-6">
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
              : data?.groups.map((group) => (
                  <div key={group.module} className="space-y-3">
                    <h4 className="border-b pb-2 text-sm font-semibold">
                      {group.module}
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onCheckedChange={(checked) =>
                              togglePermission(permission.id, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`perm-${permission.id}`}
                            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
          </div>

          <SheetFooter className="mt-auto border-t pt-6">
            <SheetClose asChild>
              <Button variant="outline">Hủy</Button>
            </SheetClose>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu Phân Quyền"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
