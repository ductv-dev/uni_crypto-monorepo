"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"

import {
  CreateUserSchema,
  type CreateUserSchemaType,
} from "@/schema/create-user.schema"
import { useCreateUser } from "@/hooks/users/use-create-user"
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
import { Plus } from "lucide-react"

type TFormCreateUserProps = {
  onSuccess?: () => void
}

export const FormCreateUser: React.FC<TFormCreateUserProps> = ({
  onSuccess,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: createUser, isPending } = useCreateUser()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      password: "",
      id_number: "",
      id_type: "",
      country: "",
    },
  })

  const onSubmit = (data: CreateUserSchemaType) => {
    createUser(data, {
      onSuccess: () => {
        toast.success("Tạo người dùng mới thành công")
        reset()
        setIsDialogOpen(false)
        onSuccess?.()
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi tạo người dùng")
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="size-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <FieldGroup className="">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="user@example.com"
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel>Tên người dùng</FieldLabel>
              <Input {...register("username")} placeholder="username" />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field>
              <FieldLabel>Số điện thoại</FieldLabel>
              <Input {...register("phone")} placeholder="+84123456789" />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field>
              <FieldLabel>Mật khẩu</FieldLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="Ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số"
              />
              <FieldError errors={[errors.password]} />
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
              <FieldLabel>Quốc gia</FieldLabel>
              <Input {...register("country")} placeholder="Tên quốc gia" />
              <FieldError errors={[errors.country]} />
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
              {isPending ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
