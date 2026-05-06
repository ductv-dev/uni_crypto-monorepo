import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guards';
import { PERMISSION_CODES } from 'src/constant/permission-code.constant';
import { Permissions } from './decorators/permissions.decorator';
import { CreatePermissionDTO, GetAllPermissionsDto } from './dto';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionService } from './permission.service';

@Controller('permission')
@UseGuards(AtGuard, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Permissions(PERMISSION_CODES.READ_PERMISSIONS)
  findAll(
    @Body()
    dto: GetAllPermissionsDto,
  ) {
    return this.permissionService.findAll(dto);
  }

  @Get(':id')
  @Permissions(PERMISSION_CODES.READ_PERMISSIONS)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }
  @Put('/status/:id')
  @Permissions(PERMISSION_CODES.UPDATE_PERMISSIONS)
  updateStatus(@Param('id') id: string) {
    return this.permissionService.updateStatus(id);
  }
  @Post('/create')
  @Permissions(PERMISSION_CODES.CREATE_PERMISSIONS)
  create(@Body() dto: CreatePermissionDTO) {
    return this.permissionService.create(dto);
  }
}
