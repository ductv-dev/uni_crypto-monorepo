"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"

import {
  UpdateUserSchema,
  type UpdateUserSchemaType,
} from "@/schema/update-user.schema"
import { useUpdateUser } from "@/hooks/users/use-update-user"
import { TUser } from "@/types/user.type"
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
import { Edit } from "lucide-react"

type TUserQuickEditProps = {
  user: TUser
}

export const UserQuickEdit: React.FC<TUserQuickEditProps> = ({ user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: updateUser, isPending } = useUpdateUser(user.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      phone: user.phone ?? "",
      username: user.username ?? "",
      id_number: user.id_number ?? "",
      id_type: user.id_type ?? "",
      status: user.status ?? "inactive",
    },
  })

  const onSubmit = (data: UpdateUserSchemaType) => {
    updateUser(data, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin người dùng thành công")
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin")
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs">
          <Edit className="h-3.5 w-3.5" />
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="">
            <Field>
              <FieldLabel>Tên người dùng</FieldLabel>
              <Input {...register("username")} placeholder="Username" />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field>
              <FieldLabel>Số điện thoại</FieldLabel>
              <Input {...register("phone")} placeholder="+84..." />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field>
              <FieldLabel>Loại định danh</FieldLabel>
              <Select
                defaultValue={watch("id_type")}
                onValueChange={(value) => setValue("id_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại định danh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Hộ chiếu</SelectItem>
                  <SelectItem value="id_card">CCCD/CMND</SelectItem>
                  <SelectItem value="driving_license">Bằng lái xe</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.id_type]} />
            </Field>

            <Field>
              <FieldLabel>Số định danh</FieldLabel>
              <Input
                {...register("id_number")}
                placeholder="Số CCCD/Hộ chiếu"
              />
              <FieldError errors={[errors.id_number]} />
            </Field>

            <Field>
              <FieldLabel>Trạng thái tài khoản</FieldLabel>
              <Select
                defaultValue={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
