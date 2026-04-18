import { TToken } from "@workspace/shared/types"

type Props = {
  data: TToken
}
export const SectionAbout: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col gap-3 p-2.5">
      <p className="text-lg font-bold text-foreground/60">
        Giới thiệu về {data.name}
      </p>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="leading-6 text-foreground/70">
          {data.name} ({data.symbol}) đang được mô phỏng như một token giao dịch
          trên BNB Smart Chain. Trang này tập trung vào những gì người dùng cần
          trước khi giao dịch: định danh token, contract, biến động giá, thanh
          khoản ước tính và một số tín hiệu rủi ro cơ bản.
        </p>
      </div>
    </div>
  )
}
