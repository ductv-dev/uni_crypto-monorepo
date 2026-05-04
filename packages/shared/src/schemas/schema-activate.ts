import z from "zod"

export const TActivateAccountSchema = z.object({
  email: z
    .string({
      message: "Email không được để trống",
    })
    .email({
      message: "Email không hợp lệ",
    }),
  hash: z.string({
    message: "Hash kích hoạt không được để trống",
  }),
})
export type TActivateAccountSchemaType = z.infer<typeof TActivateAccountSchema>
