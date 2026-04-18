import { UpdateUserSchemaType } from "@/schema/update-user.schema"
import { TUser } from "@/types/user.type"
import { useMutation, type UseMutationResult } from "@tanstack/react-query"

const updateUser = async (
  userId: string,
  userData: UpdateUserSchemaType
): Promise<TUser> => {
  // TODO: Thay thế bằng API call thực tế
  // const response = await fetch(`/api/users/${userId}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(userData),
  // })
  // if (!response.ok) throw new Error("Failed to update user")
  // return response.json()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: userId,
    email: "",
    username: userData.username,
    phone: userData.phone,
    avatar: "",
    status: userData.status,
    isEmailVerified: false,
    isPhoneVerified: false,
    isTwoFactorEnabled: false,
    kycStatus: "pending",
    dateOfBirth: "",
    gender: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    id_type: userData.id_type,
    id_number: userData.id_number,
    createdAt: "",
    updatedAt: new Date().toISOString(),
  }
}

export const useUpdateUser = (
  userId: string
): UseMutationResult<TUser, Error, UpdateUserSchemaType> => {
  return useMutation({
    mutationFn: (userData) => updateUser(userId, userData),
  })
}
