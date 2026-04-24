import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { type AccountProfileStatus } from "@/hooks/use-account-profile"
import { StatusItem } from "../components/status-item"

type AccountCompletionProps = {
  profileCompletion: number
  completedStatusCount: number
  profileStatus: AccountProfileStatus[]
}

export const AccountCompletion = ({
  profileCompletion,
  completedStatusCount,
  profileStatus,
}: AccountCompletionProps) => {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Mức độ hoàn thiện hồ sơ</CardTitle>
        <CardDescription>
          Hoàn thiện thêm thông tin để hồ sơ rõ ràng và đáng tin cậy hơn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-2xl border border-border/70 bg-background/80 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Tiến độ hoàn thiện
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {profileCompletion}%
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {completedStatusCount} mục sẵn sàng
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {profileStatus.map((item) => (
            <StatusItem key={item.label} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
