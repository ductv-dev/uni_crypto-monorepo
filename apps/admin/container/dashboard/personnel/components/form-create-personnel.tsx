"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useGetRoles } from "@/hooks/roles/use-roles"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import {
  CreatePersonnelSchema,
  type CreatePersonnelSchemaType,
} from "@/schema/personnel.schema"
import { useCreatePersonnel } from "@/hooks/personnel/use-create-personnel"
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

export const FormCreatePersonnel = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: createPersonnel, isPending } = useCreatePersonnel()
  const { data: roles = [], isLoading: isRolesLoading } = useGetRoles()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePersonnelSchemaType>({
    resolver: zodResolver(CreatePersonnelSchema),
    defaultValues: {
      email: "",
      password: "",
      roleId: "",
    },
  })

  const onSubmit = (data: CreatePersonnelSchemaType) => {
    createPersonnel(data, {
      onSuccess: () => {
        toast.success("Tạo tài khoản quản trị thành công!")
        reset()
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi tạo tài khoản quản trị")
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Tạo tài khoản
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản quản trị</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@example.com"
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel>Mật khẩu tạm thời</FieldLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="Nhập mật khẩu mạnh"
              />
              <FieldError errors={[errors.password]} />
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
              {isPending ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
