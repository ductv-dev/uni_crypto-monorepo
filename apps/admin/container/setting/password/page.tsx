"use client"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { changePasswordSchema } from "@/schema/change-password.schema"
import { useAdmin } from "@/store/admin-store"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Separator } from "@workspace/ui/components/separator"
import { toast } from "@workspace/ui/index"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

export const Password: React.FC = () => {
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const route = useRouter()

  const handleTogglePasswordVisibility = (type: string) => {
    switch (type) {
      case "oldPassword":
        setIsOldPasswordVisible(!isOldPasswordVisible)
        break
      case "newPassword":
        setIsNewPasswordVisible(!isNewPasswordVisible)
        break
      case "confirmPassword":
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
        break
    }
  }
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  const handleForgotPassword = () => {
    toast.success("Kiểm tra email để khôi phục mật khẩu")
  }
  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
    route.push("/account")
  }
  const admin = useAdmin((state) => state.admin)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/account">Account</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>Password</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="mx-auto w-full sm:max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Thay đổi mật khẩu của bạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="oldPassword"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Nhập mật khẩu cũ
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Nhập mật khẩu cũ"
                            autoComplete="off"
                            type={isOldPasswordVisible ? "text" : "password"}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                          <InputGroupAddon align="inline-end">
                            <Button
                              type="button"
                              onClick={() =>
                                handleTogglePasswordVisibility("oldPassword")
                              }
                              variant="ghost"
                              size="icon"
                            >
                              {isOldPasswordVisible ? (
                                <EyeOffIcon />
                              ) : (
                                <EyeIcon />
                              )}
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    )
                  }}
                />
                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Nhập mật khẩu mới</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="form-rhf-demo-description"
                          placeholder="Nhập mật khẩu mới"
                          aria-invalid={fieldState.invalid}
                          type={isNewPasswordVisible ? "text" : "password"}
                        />
                        <InputGroupAddon align="inline-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleTogglePasswordVisibility("newPassword")
                            }
                          >
                            {isNewPasswordVisible ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-description">
                        Xác nhận mật khẩu mới
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="form-rhf-demo-description"
                          placeholder="Xác nhận mật khẩu mới"
                          aria-invalid={fieldState.invalid}
                          type={isConfirmPasswordVisible ? "text" : "password"}
                        />
                        <InputGroupAddon align="inline-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleTogglePasswordVisibility("confirmPassword")
                            }
                          >
                            {isConfirmPasswordVisible ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="cursor-pointer text-end text-red-500">
                      Bạn quên mật khẩu?
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn quên mật khẩu?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Xác nhận bạn để nhận liên kết khôi phục mật khẩu qua
                        email {admin?.email}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Đóng</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleForgotPassword()}>
                        Xác nhận
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" form="form-rhf-demo">
                Xác nhận
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  )
}
