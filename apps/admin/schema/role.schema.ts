import { z } from "zod"

export const RoleSchema = z.object({
  name: z.string().min(1, "Tên vai trò là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  level: z.coerce
    .number()
    .int("Cấp độ phải là số nguyên")
    .min(2, "Cấp độ thấp nhất có thể tạo là 2")
    .max(10, "Cấp độ tối đa là 10"),
  status: z.enum(["active", "inactive"]),
})

export type RoleSchemaType = z.infer<typeof RoleSchema>
