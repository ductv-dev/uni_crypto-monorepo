import { Skeleton } from "@workspace/ui/components/skeleton"

export const AccountSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
