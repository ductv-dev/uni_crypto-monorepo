import { BookOrder, TradeEvent } from "./type"

export class OrderBook {
  private bids: BookOrder[] = [] // Mua: Giá cao nhất xếp trước
  private asks: BookOrder[] = [] // Bán: Giá thấp nhất xếp trước

  constructor(private readonly marketId: string) {}

  // thêm order vào book và thực hiện khớp lệnh ngay lập tức
  addOrder(order: BookOrder): TradeEvent[] {
    if (order.marketId !== this.marketId) {
      throw new Error(`Order market mismatch: ${order.marketId}`)
    }

    const trades: TradeEvent[] = []

    if (order.side === "buy") {
      this.matchOrder(order, this.asks, trades)
      // Nếu chưa khớp hết thì nạp vào book
      if (order.quantity > order.filledQty) {
        this.bids.push(order)
        this.sortBids()
      }
    } else {
      this.matchOrder(order, this.bids, trades)
      // Nếu chưa khớp hết thì nạp vào book
      if (order.quantity > order.filledQty) {
        this.asks.push(order)
        this.sortAsks()
      }
    }

    return trades
  }

  // Rebuild book từ DB mà không chạy matching side effects như tạo trade hay cập nhật ví.
  restoreOrder(order: BookOrder) {
    if (order.marketId !== this.marketId) {
      throw new Error(`Order market mismatch: ${order.marketId}`)
    }

    if (order.quantity <= order.filledQty) {
      return
    }

    if (this.hasOrder(order.id)) {
      return
    }

    if (order.side === "buy") {
      this.bids.push(order)
      this.sortBids()
      return
    }

    this.asks.push(order)
    this.sortAsks()
  }

  // Kiểm tra duplicate theo order id giữa 2 phía bid/ask.
  hasOrder(orderId: string) {
    return (
      this.bids.some((order) => order.id === orderId) ||
      this.asks.some((order) => order.id === orderId)
    )
  }

  // Khớp lệnh theo nguyên tắc maker đang đứng đầu book sau khi đã sort price-time.
  private matchOrder(
    takerOrder: BookOrder,
    counterBook: BookOrder[],
    trades: TradeEvent[]
  ) {
    while (
      counterBook.length > 0 &&
      takerOrder.quantity > takerOrder.filledQty
    ) {
      const makerOrder = counterBook[0]

      // Kiểm tra giá có khớp không
      // Taker mua: giá phải >= giá người bán (asks) thấp nhất
      if (takerOrder.side === "buy" && takerOrder.price < makerOrder.price)
        break
      // Taker bán: giá phải <= giá người mua (bids) cao nhất
      if (takerOrder.side === "sell" && takerOrder.price > makerOrder.price)
        break

      // Tính toán số lượng khớp
      const takerRemaining = takerOrder.quantity - takerOrder.filledQty
      const makerRemaining = makerOrder.quantity - makerOrder.filledQty
      const matchQty = Math.min(takerRemaining, makerRemaining)

      // Tạo trade event
      trades.push({
        makerOrderId: makerOrder.id,
        takerOrderId: takerOrder.id,
        marketId: this.marketId,
        price: makerOrder.price, // Giá lấy theo người đặt lệnh trước (Maker)
        quantity: matchQty,
        side: takerOrder.side,
      })

      // Cập nhật số lượng đã khớp
      takerOrder.filledQty += matchQty
      makerOrder.filledQty += matchQty

      // Nếu makerOrder đã khớp hết thì xóa khỏi book
      if (makerOrder.quantity === makerOrder.filledQty) {
        counterBook.shift()
      }
    }
  }

  // sắp xếp bids giảm dần theo giá
  private sortBids() {
    this.bids.sort((a, b) => {
      if (b.price !== a.price) return b.price - a.price
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }
  // sắp xếp asks tăng dần theo giá
  private sortAsks() {
    this.asks.sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  // Gộp khối lượng theo từng mức giá để trả về market depth.
  getDepth(limit: number = 20) {
    const aggregate = (orders: BookOrder[]) => {
      const map = new Map<number, number>()
      orders.forEach((o) => {
        const remaining = o.quantity - o.filledQty
        if (remaining > 0) {
          map.set(o.price, (map.get(o.price) || 0) + remaining)
        }
      })
      return Array.from(map.entries()).map(([price, quantity]) => ({
        price,
        quantity,
      }))
    }

    const bids = aggregate(this.bids)
      .sort((a, b) => b.price - a.price)
      .slice(0, limit)
    const asks = aggregate(this.asks)
      .sort((a, b) => a.price - b.price)
      .slice(0, limit)

    return { bids, asks }
  }
}
