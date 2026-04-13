// components/ui/user-avatar.tsx
import { User2 } from "lucide-react"

type Props = { src?: string; size: number }

export const UserAvatar: React.FC<Props> = ({ src, size }) => {
  if (src) {
    return (
      <img
        src={src}
        alt="avatar"
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover"
      />
    )
  }
  return <User2 size={size * 0.44} className="text-primary" />
}
