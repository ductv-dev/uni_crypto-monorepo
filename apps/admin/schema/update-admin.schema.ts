import { z } from "zod"

export const UpdateAdminSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
})
export type UpdateAdminSchemaType = z.infer<typeof UpdateAdminSchema>
