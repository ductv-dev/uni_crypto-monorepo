import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { Decimal } from 'decimal.js';
import { CreateBuyDto } from './dto/create-buy-sell.dto';
import { UpdateBuySellDto } from './dto/update-buy-sell.dto';
@Injectable()
export class BuySellService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createBuySellDto: CreateBuyDto,
    userId: string,
    ipAddress: string,
  ) {
    const { market_id, type, side, price, quantity } = createBuySellDto;

    // BƯỚC 1: KIỂM TRA SÀN (MARKET)
    // Lấy thông tin cặp giao dịch (VD: BTC/USDT) từ database dựa trên symbol.
    const market = await this.prisma.market.findUnique({
      where: { id: market_id },
      select: {
        base_asset_id: true,
        quote_asset_id: true,
        status: true,
        price_precision: true,
        quantity_precision: true,
        min_order_amount: true,
        max_order_amount: true,
        min_order_value: true,
      },
    });

    if (!market) {
      throw new NotFoundException('Market not found');
    }

    if (!market.status) {
      throw new BadRequestException('Market is currently inactive');
    }
    // Kiểm tra số lượng tối đa, tối thiểu của market quy định
    if (
      quantity < market.min_order_amount.toNumber() ||
      (market.max_order_amount && quantity > market.max_order_amount.toNumber())
    ) {
      const minAmount = market.min_order_amount.toNumber();
      const maxAmount = market.max_order_amount?.toNumber();
      throw new BadRequestException(
        maxAmount
          ? `Order quantity must be between ${minAmount} and ${maxAmount}`
          : `Order quantity must be greater than or equal to ${minAmount}`,
      );
    }
    //Kiểm tra số lượng có đúng định dạng không
    this.validatePrecision(quantity, market.quantity_precision, 'quantity');
    //Kiểm tra giá có đúng định dạng không
    if (type === 'limit') {
      this.validatePrecision(price, market.price_precision, 'price');

      // Kiểm tra giá trị tối thiểu của lệnh
      if (
        !this.validateLimitOrderValue(
          price.toString(),
          quantity.toString(),
          market.min_order_value.toString(),
        )
      ) {
        throw new BadRequestException(
          `Order value must be at least ${market.min_order_value.toNumber()}`,
        );
      }
    }

    // - Nếu lệnh BUY: Cần dùng quote_asset (VD: Mua BTC/USDT thì cần thanh toán bằng USDT).
    // - Nếu lệnh SELL: Cần dùng base_asset (VD: Bán BTC/USDT thì cần trừ BTC).
    const requiredAssetId =
      side === 'buy' ? market.quote_asset_id : market.base_asset_id;

    // Tính toán số lượng tài sản cần khóa:
    // - Lệnh BUY (Limit): Số lượng USDT cần thiết = quantity * price.
    // - Lệnh SELL: Số lượng BTC cần thiết = đúng bằng quantity bán ra.
    const requiredAmount = side === 'buy' ? quantity * price : quantity;

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
      await this.prisma.wallet.create({
        data: {
          user_id: userId,
          asset_id: requiredAssetId,
          available_balance: 0,
          blocked_balance: 0,
        },
      });
      throw new BadRequestException('Insufficient available balance');
    }

    if (wallet.available_balance.toNumber() < requiredAmount) {
      throw new BadRequestException('Insufficient available balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const newAvailable = wallet.available_balance.toNumber() - requiredAmount;
      const newBlocked = wallet.blocked_balance.toNumber() + requiredAmount;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          available_balance: newAvailable,
          blocked_balance: newBlocked,
        },
      });

      const order = await tx.orderBook.create({
        data: {
          user_id: userId,
          market_id,
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
      const walletTransaction = await tx.walletTransaction.create({
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
      await tx.outboxEvent.create({
        data: {
          event_type: 'order_created',
          status: 'pending',
          order_id: order.id,
          retry_count: 0,
          payload: {
            order: order,
            wallet: wallet,
            walletTransaction: walletTransaction,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          user_id: userId,
          action: 'order_placed',
          table_name: 'order_book, wallet, wallet_transaction',
          record_id: order.id,
          changes: {
            orderbook: {
              create: {
                id: order.id,
                user_id: userId,
                market_id,
                type,
                side,
                price,
                quantity,
                remaining_qty: quantity,
                status: 'open',
              },
            },
            wallet: {
              update: {
                id: wallet.id,
                user_id: userId,
                asset_id: requiredAssetId,
                available_balance: newAvailable,
                blocked_balance: newBlocked,
              },
            },
            wallet_transaction: {
              create: {
                id: walletTransaction.id,
                wallet_id: wallet.id,
                type: 'order_lock',
                direction: 'debit',
                amount: requiredAmount,
                balance_before: wallet.available_balance,
                balance_after: newAvailable,
                reference_type: 'order',
                reference_id: order.id,
                status: 'success',
              },
            },
          },
          ip_address: ipAddress,
        },
      });
      return order;
    });
  }
  // Hàm check định dạng số lượng và giá, nếu không đúng thì throw error
  private validatePrecision(
    inputValue: string | number,
    maxPrecision: number,
    fieldName: 'price' | 'quantity',
  ): boolean {
    const normalizedValue = inputValue.toString().replace(',', '.');
    const parts = normalizedValue.split('.');
    if (parts.length === 2 && parts[1].length > maxPrecision) {
      throw new BadRequestException(
        `Invalid ${fieldName} precision. Maximum ${maxPrecision} decimal places allowed`,
      );
    }
    return true;
  }
  private validateLimitOrderValue(
    priceInput: string,
    quantityInput: string,
    minOrderValue: string,
  ): boolean {
    try {
      const price = new Decimal(priceInput);
      const quantity = new Decimal(quantityInput);
      const minVal = new Decimal(minOrderValue);

      // Tính tổng giá trị lệnh
      const orderValue = price.mul(quantity);

      // So sánh: orderValue >= minOrderValue
      return orderValue.greaterThanOrEqualTo(minVal);
    } catch {
      return false;
    }
  }

  async findAll() {
    const order = await this.prisma.orderBook.findMany({
      where: {
        status: {
          in: ['open', 'partial_filled'],
        },
      },
      include: {
        market: {
          select: {
            symbol: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return order;
  }

  async findAvailableMarkets() {
    return this.prisma.market.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        symbol: true,
        last_price: true,
        min_order_amount: true,
        max_order_amount: true,
        min_order_value: true,
        price_precision: true,
        quantity_precision: true,
        baseAsset: {
          select: {
            id: true,
            symbol: true,
            name: true,
          },
        },
        quoteAsset: {
          select: {
            id: true,
            symbol: true,
            name: true,
          },
        },
      },
      orderBy: {
        symbol: 'asc',
      },
    });
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
