import { CreateUserSchemaType } from "@/schema/create-user.schema"
import { TUser } from "@/types/user.type"
import { useMutation, type UseMutationResult } from "@tanstack/react-query"

const createUser = async (userData: CreateUserSchemaType): Promise<TUser> => {
  // TODO: Thay thế bằng API call thực tế
  // const response = await fetch("/api/users", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(userData),
  // })
  // if (!response.ok) throw new Error("Failed to create user")
  // return response.json()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: String(Math.random()),
    email: userData.email,
    username: userData.username,
    phone: userData.phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
    status: "pending",
    isEmailVerified: false,
    isPhoneVerified: false,
    isTwoFactorEnabled: false,
    kycStatus: "pending",
    dateOfBirth: "",
    gender: "",
    country: userData.country,
    city: "",
    address: "",
    zipCode: "",
    id_type: userData.id_type,
    id_number: userData.id_number,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const useCreateUser = (): UseMutationResult<
  TUser,
  Error,
  CreateUserSchemaType
> => {
  return useMutation({
    mutationFn: createUser,
  })
}
