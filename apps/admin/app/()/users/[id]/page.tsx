import { UserDetails } from "@/container/dashboard/user-details/page"

type Props = {
  params: Promise<{ id: string }>
}

export default async function UserIdPage({ params }: Props) {
  const { id } = await params
  return <UserDetails id={id} />
}
