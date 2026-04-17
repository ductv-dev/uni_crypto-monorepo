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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
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
import { Eye } from "lucide-react"

type TFormUpdateUserProps = {
  user: TUser
}

export const FormUpdateUser: React.FC<TFormUpdateUserProps> = ({ user }) => {
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
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          <Eye className="size-4" />
          Xem chi tiết
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-1">
            <div className="flex items-center justify-center">
              <Avatar className="h-24 w-24 rounded-full border-2 border-muted shadow-sm">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="rounded-full">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Tên đăng nhập:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Số điện thoại:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Số định danh:</span>
              <span>{user.id_number}</span>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Loại định danh:</span>
              <span>{user.id_type}</span>
            </div>
            <div className="flex items-center justify-start gap-3 p-2">
              <span className="font-medium">Trạng thái tài khoản:</span>
              <span>{user.status}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div>
              <FieldGroup className="">
                {/* Read-only Fields */}

                {/* Editable Fields */}
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
                      <SelectItem value="driving_license">
                        Bằng lái xe
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.id_type]} />
                </Field>
                <Field>
                  <FieldLabel>User ID</FieldLabel>
                  <Input value={user.id} disabled className="bg-muted" />
                  <FieldLabel>Email</FieldLabel>
                  <Input value={user.email} disabled className="bg-muted" />
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
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
