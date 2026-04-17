import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { UpdateUserProfileSchemaType } from "@/schema/update-user-profile.schema"
import { TUser } from "@/types/user.type"

const updateUserProfile = async (
  userId: string,
  profileData: UpdateUserProfileSchemaType
): Promise<TUser> => {
  // TODO: Thay thế bằng API call thực tế
  // const response = await fetch(`/api/users/${userId}/profile`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(profileData),
  // })
  // if (!response.ok) throw new Error("Failed to update profile")
  // return response.json()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: userId,
    email: profileData.email,
    username: profileData.username,
    phone: profileData.phone,
    avatar: profileData.avatar || "",
    status: "active",
    isEmailVerified: false,
    isPhoneVerified: false,
    isTwoFactorEnabled: false,
    kycStatus: "pending",
    dateOfBirth: profileData.dateOfBirth || "",
    gender: profileData.gender || "",
    country: profileData.country || "",
    city: profileData.city || "",
    address: profileData.address || "",
    zipCode: profileData.zipCode || "",
    id_type: "",
    id_number: "",
    createdAt: "",
    updatedAt: new Date().toISOString(),
  }
}

export const useUpdateUserProfile = (
  userId: string
): UseMutationResult<TUser, Error, UpdateUserProfileSchemaType> => {
  return useMutation({
    mutationFn: (profileData) => updateUserProfile(userId, profileData),
  })
}
