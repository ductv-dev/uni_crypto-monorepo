import { z } from "zod"

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải có ít nhất 1 chữ cái viết hoa")
      .regex(/[a-z]/, "Phải có ít nhất 1 chữ cái viết thường")
      .regex(/[0-9]/, "Phải có ít nhất 1 chữ số")
      .regex(/[^a-zA-Z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
