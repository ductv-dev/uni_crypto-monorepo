import { CardMethodAddWallet } from "@/components/custom/cards/card-method-add-wallet"
import { DataMethodsAddWallet } from "@/data/mock-data-methos-add-wallet"

export const ListAddWallet = () => {
  return (
    <div className="m-2.5 flex flex-col items-center gap-2">
      {DataMethodsAddWallet.map((item) => (
        <CardMethodAddWallet
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  )
}
