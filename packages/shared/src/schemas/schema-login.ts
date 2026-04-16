import z from "zod"

export const LoginSchema = z.object({
  email: z
    .string({
      message: "Email không được để trống",
    })
    .email({
      message: "Email không hợp lệ",
    }),
  password: z
    .string({})
    .min(8, { message: "Mật khẩu phải ít nhất 8 ký tự" })
    .max(20, { message: "Mật khẩu phải ít hơn 20 ký tự" }),
})
export type LoginSchemaType = z.infer<typeof LoginSchema>
