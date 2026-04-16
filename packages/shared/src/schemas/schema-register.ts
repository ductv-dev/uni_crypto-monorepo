import z from "zod"

export const RegisterSchema = z
  .object({
    email: z
      .string({
        message: "Email không được để trống",
      })
      .email({
        message: "Email không hợp lệ",
      }),
    password: z
      .string()
      .min(8, "Mật khẩu phải ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải có ít nhất 1 chữ cái viết hoa")
      .regex(/[a-z]/, "Phải có ít nhất 1 chữ cái viết thường")
      .regex(/[0-9]/, "Phải có ít nhất 1 chữ số")
      .regex(/[^a-zA-Z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
