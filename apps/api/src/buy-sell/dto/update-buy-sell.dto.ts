import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyDto } from './create-buy-sell.dto';

export class UpdateBuySellDto extends PartialType(CreateBuyDto) {}
