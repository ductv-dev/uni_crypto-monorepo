import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from '@workspace/db';
import { GetCandlesDto } from './dto/get-candles.dto';
import { CandleInterval } from './enums/candle-interval.enum';
import { Candle } from './interfaces/candle.interface';

type CandleScalar = Prisma.Decimal | string | number | bigint | null;

interface CandleQueryRow {
  bucket: Date;
  open: CandleScalar;
  high: CandleScalar;
  low: CandleScalar;
  close: CandleScalar;
  volume: CandleScalar;
  quoteVolume: CandleScalar;
}

interface ResolvedCandleQuery {
  interval: CandleInterval;
  from: Date;
  to: Date;
  limit: number;
}

const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 1000;
const DEFAULT_LOOKBACK_IN_MS = 24 * 60 * 60 * 1000;
const GAPFILL_BUCKET_MAP: Record<CandleInterval, string> = {
  [CandleInterval.ONE_MINUTE]: '1 minute',
  [CandleInterval.FIVE_MINUTES]: '5 minutes',
  [CandleInterval.FIFTEEN_MINUTES]: '15 minutes',
  [CandleInterval.ONE_HOUR]: '1 hour',
  [CandleInterval.FOUR_HOURS]: '4 hours',
  [CandleInterval.ONE_DAY]: '1 day',
} as const;

@Injectable()
export class CandlesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCandles(marketId: string, dto: GetCandlesDto): Promise<Candle[]> {
    const { interval, from, to, limit } = this.resolveQuery(dto);
    const bucketWidth = GAPFILL_BUCKET_MAP[interval];

    const rows = await this.prisma.$queryRaw<CandleQueryRow[]>(Prisma.sql`
      WITH gapfill_cte AS (
        SELECT
          time_bucket_gapfill(
            ${Prisma.raw(`INTERVAL '${bucketWidth}'`)},
            "createdAt",
            ${from},
            ${to}
          ) AS bucket,
          FIRST(price, "createdAt") AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, "createdAt") AS close,
          locf(LAST(price, "createdAt")) AS close_filled,
          SUM(quantity) AS volume,
          SUM(total) AS "quoteVolume"
        FROM "Trade"
        WHERE market_id = ${marketId}
          AND "createdAt" >= ${from}
          AND "createdAt" <= ${to}
        GROUP BY bucket
      ),
      limited_candles AS (
        SELECT
          bucket,
          COALESCE(open, close_filled, 0)::text AS open,
          COALESCE(high, close_filled, 0)::text AS high,
          COALESCE(low, close_filled, 0)::text AS low,
          COALESCE(close_filled, 0)::text AS close,
          COALESCE(volume, 0)::text AS volume,
          COALESCE("quoteVolume", 0)::text AS "quoteVolume"
        FROM gapfill_cte
        ORDER BY bucket DESC
        LIMIT ${limit}
      )
      SELECT
        bucket,
        open,
        high,
        low,
        close,
        volume,
        "quoteVolume"
      FROM limited_candles
      ORDER BY bucket ASC
    `);

    return rows.map((row) => ({
      bucket: new Date(row.bucket),
      open: this.toDecimalString(row.open),
      high: this.toDecimalString(row.high),
      low: this.toDecimalString(row.low),
      close: this.toDecimalString(row.close),
      volume: this.toDecimalString(row.volume),
      quoteVolume: this.toDecimalString(row.quoteVolume),
    }));
  }

  private resolveQuery(dto: GetCandlesDto): ResolvedCandleQuery {
    const interval = this.parseInterval(dto.interval);
    const to = this.parseDate(dto.to, 'to') ?? new Date();
    const from =
      this.parseDate(dto.from, 'from') ??
      new Date(to.getTime() - DEFAULT_LOOKBACK_IN_MS);
    const limit = this.parseLimit(dto.limit);

    if (from > to) {
      throw new BadRequestException(
        '`from` must be less than or equal to `to`',
      );
    }

    return {
      interval,
      from,
      to,
      limit,
    };
  }

  private parseInterval(value: unknown): CandleInterval {
    if (
      typeof value === 'string' &&
      Object.values(CandleInterval).includes(value as CandleInterval)
    ) {
      return value as CandleInterval;
    }

    throw new BadRequestException('Invalid candle interval');
  }

  private parseDate(
    value: unknown,
    fieldName: 'from' | 'to',
  ): Date | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (value instanceof Date) {
      if (!Number.isNaN(value.getTime())) {
        return value;
      }

      throw new BadRequestException(`Invalid \`${fieldName}\` date`);
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    throw new BadRequestException(`Invalid \`${fieldName}\` date`);
  }

  private parseLimit(value: unknown): number {
    if (value === undefined || value === null || value === '') {
      return DEFAULT_LIMIT;
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
      throw new BadRequestException(
        `\`limit\` must be an integer between 1 and ${MAX_LIMIT}`,
      );
    }

    return parsed;
  }

  private toDecimalString(value: CandleScalar): string {
    if (value === null) {
      return '0';
    }

    if (value instanceof Prisma.Decimal) {
      return value.toString();
    }

    return String(value);
  }
}
