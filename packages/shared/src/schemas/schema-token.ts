import { z } from "zod"

export const TokenCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  address: z.string().min(1, "Smart Contract Address is required"),
  decimals: z.coerce.number().min(0, "Decimals must be a positive number"),
  network: z.string().min(1, "Network is required"),
  logoURI: z.string().url("Must be a valid URL").optional(),
})

export type TokenCreateSchemaType = z.infer<typeof TokenCreateSchema>
