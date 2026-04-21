import { ERiskLevel } from "@/types/transaction.type"
import { Badge } from "@workspace/ui/components/badge"
import { Dot } from "lucide-react"

type TRiskLevel = {
  riskLevel?: ERiskLevel
}

export const RiskLevel = ({ riskLevel }: TRiskLevel) => {
  const getStatusConfig = (riskLevel?: ERiskLevel) => {
    switch (riskLevel) {
      case ERiskLevel.HIGH:
        return {
          label: "High",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50",
          dotClassName: "text-green-600 dark:text-green-400",
        }
      case ERiskLevel.MEDIUM:
        return {
          label: "Medium",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
          dotClassName: "text-yellow-600 dark:text-yellow-400",
        }
      case ERiskLevel.LOW:
        return {
          label: "Low",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50",
          dotClassName: "text-red-600 dark:text-red-400",
        }

      default:
        return {
          label: riskLevel ?? "N/A",
          className: "bg-gray-100 text-gray-800",
          dotClassName: "text-gray-600",
        }
    }
  }

  const config = getStatusConfig(riskLevel)

  return (
    <Badge variant="outline" className={config.className}>
      <Dot className={config.dotClassName} />
      {config.label}
    </Badge>
  )
}
