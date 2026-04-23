"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/index"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useUpdateUserProfile } from "@/hooks/users/use-update-user-profile"
import {
  UpdateUserProfileSchema,
  type UpdateUserProfileSchemaType,
} from "@/schema/update-user-profile.schema"
import { TUser } from "@/types/user.type"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Calendar, Eye, Mail, MapPin, Phone, User } from "lucide-react"

type TUserDetailViewProps = {
  user: TUser
}

const StatItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value}</p>
    </div>
  </div>
)

export const UserDetailView: React.FC<TUserDetailViewProps> = ({ user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: updateProfile, isPending } = useUpdateUserProfile(user.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProfileSchemaType>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      avatar: user.avatar ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      gender: user.gender ?? "",
      country: user.country ?? "",
      city: user.city ?? "",
      address: user.address ?? "",
      zipCode: user.zipCode ?? "",
    },
  })

  const onSubmit = (data: UpdateUserProfileSchemaType) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin cá nhân thành công")
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin")
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          <Eye className="size-4" />
          Xem chi tiết
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Hồ sơ người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar & Basic Info Section */}
          <div className="flex flex-col gap-6 border-b pb-6 sm:flex-row">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-2 border-primary shadow-lg">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-xl font-semibold">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Trạng thái
                  </p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                  >
                    {user.status === "active"
                      ? "Đang hoạt động"
                      : user.status === "inactive"
                        ? "Ngừng hoạt động"
                        : "Đang chờ"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Xác minh KYC
                  </p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getKycStatusColor(user.kycStatus)}`}
                  >
                    {user.kycStatus === "verified"
                      ? "Đã xác minh"
                      : user.kycStatus === "pending"
                        ? "Chờ xác minh"
                        : "Bị từ chối"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Email verified
                  </p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${user.isEmailVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {user.isEmailVerified ? "✓ Xác minh" : "Chưa xác minh"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    2FA
                  </p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${user.isTwoFactorEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {user.isTwoFactorEnabled ? "✓ Bật" : "Tắt"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Thông tin liên hệ</h3>
              <StatItem label="Email" value={user.email} icon={Mail} />
              <StatItem
                label="Số điện thoại"
                value={user.phone || "N/A"}
                icon={Phone}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Thông tin cá nhân</h3>
              <StatItem
                label="Giới tính"
                value={user.gender || "N/A"}
                icon={User}
              />
              <StatItem
                label="Ngày sinh"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : "N/A"
                }
                icon={Calendar}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Địa chỉ</h3>
              <StatItem
                label="Quốc gia"
                value={user.country || "N/A"}
                icon={MapPin}
              />
              <StatItem
                label="Thành phố"
                value={user.city || "N/A"}
                icon={MapPin}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Định danh</h3>
              <StatItem
                label="Loại định danh"
                value={user.id_type || "N/A"}
                icon={User}
              />
              <StatItem
                label="Số định danh"
                value={user.id_number || "N/A"}
                icon={User}
              />
            </div>
          </div>

          <Separator />

          {/* Edit Form */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="address">Địa chỉ</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup className="">
                  <Field>
                    <FieldLabel>Tên người dùng</FieldLabel>
                    <Input {...register("username")} placeholder="Username" />
                    <FieldError errors={[errors.username]} />
                  </Field>

                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      disabled
                      className="bg-muted"
                    />
                    <FieldError errors={[errors.email]} />
                  </Field>

                  <Field>
                    <FieldLabel>Số điện thoại</FieldLabel>
                    <Input {...register("phone")} placeholder="Số điện thoại" />
                    <FieldError errors={[errors.phone]} />
                  </Field>

                  <Field>
                    <FieldLabel>Avatar URL</FieldLabel>
                    <Input
                      {...register("avatar")}
                      placeholder="https://..."
                      type="url"
                    />
                    <FieldError errors={[errors.avatar]} />
                  </Field>

                  <Field>
                    <FieldLabel>Giới tính</FieldLabel>
                    <Input {...register("gender")} placeholder="Nam/Nữ" />
                    <FieldError errors={[errors.gender]} />
                  </Field>

                  <Field>
                    <FieldLabel>Ngày sinh</FieldLabel>
                    <Input {...register("dateOfBirth")} type="date" />
                    <FieldError errors={[errors.dateOfBirth]} />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup className="">
                  <Field>
                    <FieldLabel>Quốc gia</FieldLabel>
                    <Input {...register("country")} placeholder="Quốc gia" />
                    <FieldError errors={[errors.country]} />
                  </Field>

                  <Field>
                    <FieldLabel>Thành phố</FieldLabel>
                    <Input {...register("city")} placeholder="Thành phố" />
                    <FieldError errors={[errors.city]} />
                  </Field>

                  <Field>
                    <FieldLabel>Địa chỉ</FieldLabel>
                    <Input {...register("address")} placeholder="Địa chỉ" />
                    <FieldError errors={[errors.address]} />
                  </Field>

                  <Field>
                    <FieldLabel>Mã bưu điện</FieldLabel>
                    <Input {...register("zipCode")} placeholder="Mã bưu điện" />
                    <FieldError errors={[errors.zipCode]} />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
