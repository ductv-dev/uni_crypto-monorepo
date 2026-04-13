import { z } from "zod"

export const RegisterSchema = z
  .object({
    email: z
      .string({
        message: "Name must be a string",
      })
      .email({
        message: "Invalid email address",
      }),
    password: z
      .string()
      .min(8, "Ít nhất 8 ký tự")
      .regex(/[a-z]/, "Phải có chữ thường")
      .regex(/[A-Z]/, "Phải có chữ hoa")
      .regex(/\d/, "Phải có số")
      .regex(/[^A-Za-z\d]/, "Phải có ký tự đặc biệt"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
