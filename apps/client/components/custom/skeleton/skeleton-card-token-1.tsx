import { Skeleton } from "@workspace/ui/components/skeleton"

export function SkeletonCardToken1() {
  return (
    <div className="justify-betweens flex w-full items-center gap-4">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-10 w-10" />
    </div>
  )
}
