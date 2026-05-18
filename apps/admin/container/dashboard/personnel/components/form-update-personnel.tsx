"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useGetRoles } from "@/hooks/roles/use-roles"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Edit2 } from "lucide-react"

import {
  UpdatePersonnelSchema,
  type UpdatePersonnelSchemaType,
} from "@/schema/personnel.schema"
import { TPersonnel } from "@/types/personnel.type"
import { useUpdatePersonnel } from "@/hooks/personnel/use-update-personnel"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const FormUpdatePersonnel = ({
  personnel,
}: {
  personnel: TPersonnel
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: roles = [], isLoading: isRolesLoading } = useGetRoles()
  const { mutate: updatePersonnel, isPending } = useUpdatePersonnel(
    personnel.id
  )

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdatePersonnelSchemaType>({
    resolver: zodResolver(UpdatePersonnelSchema),
    defaultValues: {
      roleId: personnel.roleId,
    },
  })

  const onSubmit = (data: UpdatePersonnelSchemaType) => {
    updatePersonnel(data, {
      onSuccess: () => {
        toast.success("Cập nhật vai trò thành công!")
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật")
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Edit2 className="mr-2 h-4 w-4" />
          Cập nhật vai trò
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật vai trò tài khoản</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Tài khoản</FieldLabel>
              <Input value={personnel.email} disabled />
            </Field>

            <Field>
              <FieldLabel>Vai trò</FieldLabel>
              <Select
                defaultValue={watch("roleId")}
                onValueChange={(value) => setValue("roleId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name} - Level {role.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.roleId]} />
            </Field>
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending || isRolesLoading}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
