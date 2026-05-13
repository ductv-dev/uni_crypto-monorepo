import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMarketDto } from './create-market.dto';

export class UpdateMarketDto extends PartialType(
  OmitType(CreateMarketDto, [
    'symbol',
    'base_asset_id',
    'quote_asset_id',
  ] as const),
) {}
