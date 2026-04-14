import { CardPermission } from "@/components/custom/card/card-permission"
import { TAdmin, TRole } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
type Props = {
  permissions: Array<{
    id: number
    name: string
    description: string
    actions: string[]
  }>
  roleIcon: Record<TRole, React.ReactNode>
  roleLabel: Record<TRole, string>
  admin: TAdmin
}
export const Permission: React.FC<Props> = ({
  permissions,
  roleIcon,
  roleLabel,
  admin,
}) => {
  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Diary</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm">{roleIcon[admin.role]}</span>
          <span className="text-sm">{roleLabel[admin.role]}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {permissions.map((permission) => (
            <CardPermission key={permission.id} {...permission} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
