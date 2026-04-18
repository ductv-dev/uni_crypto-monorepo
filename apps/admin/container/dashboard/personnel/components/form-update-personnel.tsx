"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Edit2 } from "lucide-react"

import {
  PersonnelSchema,
  type PersonnelSchemaType,
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
  const { mutate: updatePersonnel, isPending } = useUpdatePersonnel(
    personnel.id
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonnelSchemaType>({
    resolver: zodResolver(PersonnelSchema),
    defaultValues: {
      fullName: personnel.fullName,
      email: personnel.email,
      role: personnel.role,
      status: personnel.status,
    },
  })

  const onSubmit = (data: PersonnelSchemaType) => {
    updatePersonnel(data, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công!")
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
          Chỉnh sửa Admin
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập Nhật Thông Tin Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Họ và tên</FieldLabel>
              <Input {...register("fullName")} placeholder="Nhập họ và tên" />
              <FieldError errors={[errors.fullName]} />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@example.com"
                disabled
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel>Vai trò</FieldLabel>
              <Select
                defaultValue={watch("role")}
                onValueChange={(value) => setValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.role]} />
            </Field>

            <Field>
              <FieldLabel>Trạng thái</FieldLabel>
              <Select
                defaultValue={watch("status")}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setValue("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
