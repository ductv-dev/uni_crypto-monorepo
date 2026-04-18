"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Edit2 } from "lucide-react"

import { RoleSchema, type RoleSchemaType } from "@/schema/role.schema"
import { TRole } from "@/types/role.type"
import { useUpdateRole } from "@/hooks/roles/use-update-role"
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
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const FormUpdateRole = ({ role }: { role: TRole }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: updateRole, isPending } = useUpdateRole(role.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleSchemaType>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description,
      status: role.status,
    },
  })

  const onSubmit = (data: RoleSchemaType) => {
    updateRole(data, {
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
          Chỉnh sửa Vai trò
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập Nhật Vai Trò</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Tên vai trò</FieldLabel>
              <Input {...register("name")} placeholder="Ví dụ: Editor" />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel>Mô tả</FieldLabel>
              <Textarea
                {...register("description")}
                placeholder="Mô tả quyền hạn của vai trò này"
                className="resize-none"
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field>
              <FieldLabel>Trạng thái</FieldLabel>
              <Select
                defaultValue={watch("status")}
                onValueChange={(value: "active" | "inactive") =>
                  setValue("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
