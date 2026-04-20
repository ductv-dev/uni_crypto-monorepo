import { useCreateToken } from "@/hooks/token/use-create-token"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  TokenCreateSchema,
  TokenCreateSchemaType,
} from "@workspace/shared/schemas"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/index"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

type TDialogCreateToken = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DialogCreateToken: React.FC<TDialogCreateToken> = ({
  open,
  onOpenChange,
}) => {
  const createTokenMutation = useCreateToken()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TokenCreateSchemaType>({
    resolver: zodResolver(TokenCreateSchema),
    defaultValues: {
      name: "",
      symbol: "",
      address: "",
      decimals: 18,
      network: "ERC20",
      logoURI: "",
    },
  })

  const onSubmit = (data: TokenCreateSchemaType) => {
    createTokenMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Thêm mới token thành công!")
        reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(`Thêm token thất bại: ${error.message}`)
      },
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm mới Token</DialogTitle>
          <DialogDescription>
            Nhập thông tin token mới bao gồm địa chỉ Smart Contract và mạng lưới
            hỗ trợ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Tên Token</FieldLabel>
              <Input placeholder="Ví dụ: Ethereum" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Mã (Symbol)</FieldLabel>
                <Input placeholder="Ví dụ: ETH" {...register("symbol")} />
                <FieldError errors={[errors.symbol]} />
              </Field>
              <Field>
                <FieldLabel>Decimals</FieldLabel>
                <Input
                  type="number"
                  placeholder="18"
                  {...register("decimals")}
                />
                <FieldError errors={[errors.decimals]} />
              </Field>
            </div>

            <Field>
              <FieldLabel>Địa chỉ Smart Contract</FieldLabel>
              <Input placeholder="0x..." {...register("address")} />
              <FieldError errors={[errors.address]} />
            </Field>

            <Field>
              <FieldLabel>Mạng lưới hỗ trợ</FieldLabel>
              <Select
                defaultValue={watch("network")}
                onValueChange={(value) => setValue("network", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mạng lưới" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERC20">Ethereum (ERC20)</SelectItem>
                  <SelectItem value="BEP20">BNB Chain (BEP20)</SelectItem>
                  <SelectItem value="TRC20">Tron (TRC20)</SelectItem>
                  <SelectItem value="POLYGON">Polygon</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.network]} />
            </Field>

            <Field>
              <FieldLabel>Đường dẫn Logo (Tùy chọn)</FieldLabel>
              <Input placeholder="https://..." {...register("logoURI")} />
              <FieldError errors={[errors.logoURI]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createTokenMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createTokenMutation.isPending}>
              {createTokenMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Thêm Token
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
