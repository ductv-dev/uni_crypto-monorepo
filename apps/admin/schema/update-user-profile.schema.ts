import { z } from "zod"

export const UpdateUserProfileSchema = z.object({
  username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  avatar: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
})

export type UpdateUserProfileSchemaType = z.infer<
  typeof UpdateUserProfileSchema
>
