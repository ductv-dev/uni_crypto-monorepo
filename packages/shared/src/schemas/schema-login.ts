import z from "zod"

export const LoginSchema = z.object({
  email: z
    .string({
      message: "Name must be a string",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({})
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must be less than 20 characters" }),
})
export type LoginSchemaType = z.infer<typeof LoginSchema>
