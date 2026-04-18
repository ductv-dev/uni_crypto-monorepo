import { z } from "zod"

export const PersonnelSchema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  status: z.enum(["active", "inactive", "pending"]),
})

export type PersonnelSchemaType = z.infer<typeof PersonnelSchema>
