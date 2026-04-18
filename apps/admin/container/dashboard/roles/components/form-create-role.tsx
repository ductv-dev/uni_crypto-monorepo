"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { RoleSchema, type RoleSchemaType } from "@/schema/role.schema"
import { useCreateRole } from "@/hooks/roles/use-create-role"
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

export const FormCreateRole = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: createRole, isPending } = useCreateRole()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoleSchemaType>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  })

  const onSubmit = (data: RoleSchemaType) => {
    createRole(data, {
      onSuccess: () => {
        toast.success("Tạo vai trò mới thành công!")
        reset()
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi tạo vai trò")
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
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
              {isPending ? "Đang tạo..." : "Tạo vai trò"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
