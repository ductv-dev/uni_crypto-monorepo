import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateRolePermissionsDto {
  @IsNotEmpty()
  @IsArray()
  permission_id: string[];
}
