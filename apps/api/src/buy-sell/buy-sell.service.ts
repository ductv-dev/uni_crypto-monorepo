import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { CreateBuyDto } from './dto/create-buy-sell.dto';
import { UpdateBuySellDto } from './dto/update-buy-sell.dto';

@Injectable()
export class BuySellService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBuySellDto: CreateBuyDto, userId: string) {
    const { symbol, type, side, price, quantity } = createBuySellDto;

    // BƯỚC 1: KIỂM TRA SÀN (MARKET)
    // Lấy thông tin cặp giao dịch (VD: BTC/USDT) từ database dựa trên symbol.
    const market = await this.prisma.market.findUnique({
      where: { symbol },
    });

    if (!market) {
      throw new NotFoundException(`Market ${symbol} not found`);
    }

    if (!market.status) {
      throw new BadRequestException(`Market ${symbol} is currently inactive`);
    }

    // BƯỚC 2: XÁC ĐỊNH TÀI SẢN VÀ SỐ LƯỢNG CẦN THIẾT
    // - Nếu lệnh BUY: Cần dùng quote_asset (VD: Mua BTC/USDT thì cần thanh toán bằng USDT).
    // - Nếu lệnh SELL: Cần dùng base_asset (VD: Bán BTC/USDT thì cần trừ BTC).
    const requiredAssetId =
      side === 'buy' ? market.quote_asset_id : market.base_asset_id;

    // Tính toán số lượng tài sản cần khóa:
    // - Lệnh BUY (Limit): Số lượng USDT cần thiết = quantity * price.
    // - Lệnh SELL: Số lượng BTC cần thiết = đúng bằng quantity bán ra.
    const requiredAmount = side === 'buy' ? quantity * price : quantity;

    // BƯỚC 3: KIỂM TRA VÍ (WALLET)
    // Tìm ví của user tương ứng với loại tài sản vừa xác định ở trên.
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        user_id_asset_id: {
          user_id: userId,
          asset_id: requiredAssetId,
        },
      },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found for this asset');
    }

    // Đảm bảo số dư khả dụng (available) không nhỏ hơn số lượng cần để đặt lệnh.
    if (wallet.available_balance.toNumber() < requiredAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    // BƯỚC 4: LƯU VÀO BẢNG ORDER VÀ KHÓA SỐ DƯ (DÙNG TRANSACTION)
    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu: Nếu 1 thao tác lỗi, toàn bộ sẽ bị rollback.
    return this.prisma.$transaction(async (tx) => {
      // 4.1. Khóa số dư trong ví:
      // - Trừ phần tiền cần thiết khỏi available_balance.
      // - Cộng phần tiền đó vào blocked_balance (tiền bị giam khi lệnh đang mở).
      const newAvailable = wallet.available_balance.toNumber() - requiredAmount;
      const newBlocked = wallet.blocked_balance.toNumber() + requiredAmount;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          available_balance: newAvailable,
          blocked_balance: newBlocked,
        },
      });

      // 4.2. Lưu thông tin lệnh vào bảng OrderBook:
      // - Trạng thái ban đầu là 'open' (đang chờ khớp).
      // - remaining_qty lúc này chính là toàn bộ quantity (chưa khớp được phần nào).
      const order = await tx.orderBook.create({
        data: {
          user_id: userId,
          market_id: market.id,
          type: type,
          side: side,
          price: price,
          quantity: quantity,
          remaining_qty: quantity,
          status: 'open',
        },
      });

      // 4.3. Lưu lịch sử biến động ví (WalletTransaction):
      // Ghi lại hành động khóa tiền ('order_lock') để phục vụ tra soát (audit) sau này.
      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'order_lock',
          direction: 'debit', // debit vì thao tác này làm giảm số dư khả dụng (available)
          amount: requiredAmount,
          balance_before: wallet.available_balance, // Số dư trước khi khóa
          balance_after: newAvailable, // Số dư sau khi khóa
          reference_type: 'order',
          reference_id: order.id,
          status: 'success',
        },
      });

      // Trả về thông tin lệnh vừa tạo
      return order;
    });
  }

  findAll() {
    return `This action returns all buySell`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buySell`;
  }

  update(id: number, updateBuySellDto: UpdateBuySellDto) {
    return `This action updates a #${id} buySell`;
  }

  remove(id: number) {
    return `This action removes a #${id} buySell`;
  }
}
