import { BottomSheetBuySell } from "../bottom-sheet/bottom-sheet-buy-sell"
import { BottomSheetReceive } from "../bottom-sheet/bottom-sheet-receive"
import { BottomSheetSend } from "../bottom-sheet/bottom-sheet-send"
import { BottomSheetSwap } from "../bottom-sheet/bottom-sheet-swap"

export const SectionAction = () => {
  return (
    <div className="no-scrollbar flex w-full gap-2.5 overflow-x-auto p-2.5">
      <BottomSheetSwap isMini={false} />
      <BottomSheetBuySell />
      <BottomSheetReceive />
      <BottomSheetSend />
    </div>
  )
}
