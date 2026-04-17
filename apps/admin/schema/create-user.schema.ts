import { z } from "zod"

export const CreateUserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  username: z
    .string()
    .min(3, "Tên người dùng ít nhất 3 ký tự")
    .max(32, "Tên người dùng tối đa 32 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Phải chứa ít nhất một chữ hoa")
    .regex(/[a-z]/, "Phải chứa ít nhất một chữ thường")
    .regex(/[0-9]/, "Phải chứa ít nhất một chữ số"),
  id_number: z.string().min(1, "Vui lòng nhập số định danh"),
  id_type: z.string().min(1, "Vui lòng chọn loại định danh"),
  country: z.string().min(1, "Vui lòng nhập tên quốc gia"),
})

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>
