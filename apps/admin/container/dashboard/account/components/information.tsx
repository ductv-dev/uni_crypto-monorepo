import { roleLabel } from "@/lib/config/role-config"
import {
  UpdateAdminSchema,
  UpdateAdminSchemaType,
} from "@/schema/update-admin.schema"
import { TAdmin } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/index"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type Props = {
  admin: TAdmin
}
export const Information: React.FC<Props> = ({ admin }) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAdminSchemaType>({
    defaultValues: {
      name: admin.name,
      phone: admin.phone,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(UpdateAdminSchema as any),
  })
  const onSubmit: SubmitHandler<UpdateAdminSchemaType> = (data) => {
    console.log(data)
    toast.success(
      `Update successfully. Name: ${data.name} Phone: ${data.phone}`
    )
    setIsOpen(false)
  }
  return (
    <Card className="">
      <CardHeader className="relative flex flex-row justify-center">
        <Avatar className="h-24 w-24 rounded-full border-2 border-muted shadow-sm">
          <AvatarImage src={admin.avatar} alt={admin.name} />
          <AvatarFallback className="rounded-full">
            {admin.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="absolute top-0 right-4 h-8 w-8 rounded-full border shadow-sm hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Update Account</DrawerTitle>
              <DrawerDescription>
                Update your account information.
              </DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...register("name")}
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      {...register("phone")}
                      id="phone"
                      type="text"
                      placeholder="Enter your phone"
                    />
                    {errors.phone && (
                      <span className="text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Button type="submit">Update</Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>{" "}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm">{admin.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email</span>
            <span className="text-sm">{admin.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phone</span>
            <span className="text-sm">{admin.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Role</span>
            <span className="text-sm">{roleLabel[admin.role]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {admin.status === "active" ? (
              <Badge className="bg-green-100 text-green-500">
                <span className="size-2.5 rounded-full bg-green-500" />
                Active
              </Badge>
            ) : admin.status === "inactive" ? (
              <Badge className="bg-gray-100 text-gray-500">
                <span className="size-2.5 rounded-full bg-gray-500" />
                Inactive
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-500">
                <span className="size-2.5 rounded-full bg-red-500" />
                Banned
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
