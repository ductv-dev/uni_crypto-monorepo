import { z } from "zod"

export const RoleSchema = z.object({
  name: z.string().min(1, "Tên vai trò là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  status: z.enum(["active", "inactive"]),
})

export type RoleSchemaType = z.infer<typeof RoleSchema>
