import { z } from "zod"

export const UpdateUserSchema = z.object({
  phone: z.string(),
  username: z.string(),
  id_number: z.string().min(1, "Vui lòng nhập số định danh"),
  id_type: z.string().min(1, "Vui lòng chọn loại định danh"),
  status: z.string(),
})

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>
