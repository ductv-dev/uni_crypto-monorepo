"use client"

import { TFeeConfig } from "@/data/mock-data-fee"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Switch } from "@workspace/ui/components/switch"
import { Edit3 } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  config: TFeeConfig
  onSave: (nextConfig: TFeeConfig) => void
}

export const FeeConfigEditDialog: React.FC<Props> = ({ config, onSave }) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<TFeeConfig>(config)

  useEffect(() => {
    setDraft(config)
  }, [config, open])

  const handleSave = () => {
    onSave(draft)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Fee Settings - {config.asset}</DialogTitle>
          <DialogDescription>
            Update trading fee percentage, flat fees, and activation status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Trading fee %</label>
            <Input
              type="number"
              step="0.01"
              value={draft.tradingFeePercent}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  tradingFeePercent: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Withdraw fee flat</label>
            <Input
              type="number"
              step="0.0001"
              value={draft.withdrawFeeFlat}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  withdrawFeeFlat: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Deposit fee flat</label>
            <Input
              type="number"
              step="0.0001"
              value={draft.depositFeeFlat}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  depositFeeFlat: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
            <span className="text-sm font-medium">Fee enabled</span>
            <Switch
              checked={draft.isActive}
              onCheckedChange={(checked) =>
                setDraft((current) => ({
                  ...current,
                  isActive: checked,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
