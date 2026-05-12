import { PartialType } from '@nestjs/mapped-types';
import { CreateTestConnectDbDto } from './create-test-connect-db.dto';

export class UpdateTestConnectDbDto extends PartialType(
  CreateTestConnectDbDto,
) {}
