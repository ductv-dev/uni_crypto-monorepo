"use client"

import { Dot } from "lucide-react"

type TUserStatusBadgeProps = {
  status: string
}

export const UserStatusBadge: React.FC<TUserStatusBadgeProps> = ({
  status,
}) => {
  const styles =
    status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : status === "inactive"
        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles}`}
    >
      <Dot className="mr-1 h-3 w-3" /> {status}
    </span>
  )
}
