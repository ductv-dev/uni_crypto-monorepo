import { z } from "zod"

export const CreatePersonnelSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  roleId: z.string().min(1, "Vui lòng chọn vai trò"),
})

export const UpdatePersonnelSchema = z.object({
  roleId: z.string().min(1, "Vui lòng chọn vai trò"),
})

export type CreatePersonnelSchemaType = z.infer<typeof CreatePersonnelSchema>
export type UpdatePersonnelSchemaType = z.infer<typeof UpdatePersonnelSchema>
