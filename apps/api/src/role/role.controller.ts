import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TypeAccount } from 'generated/prisma/enums';
import { AccountType, getCurrentUser } from 'src/auth/decorators';
import { AccountTypeGuard, AtGuard } from 'src/auth/guards';
import { PERMISSION_CODES } from 'src/constant/permission-code.constant';
import { Permissions } from 'src/permission/decorators/permissions.decorator';
import { PermissionGuard } from 'src/permission/guards/permission.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permission.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
@UseGuards(AtGuard, PermissionGuard, AccountTypeGuard)
@AccountType(TypeAccount.admin)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions(PERMISSION_CODES.CREATE_ROLES)
  create(
    @Body() createRoleDto: CreateRoleDto,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.roleService.create(createRoleDto, roleLevel);
  }

  @Get()
  @Permissions(PERMISSION_CODES.READ_ROLES)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSION_CODES.READ_ROLES)
  @AccountType(TypeAccount.admin)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Get(':id/permission')
  @Permissions(PERMISSION_CODES.READ_ROLE_PERMISSIONS)
  @AccountType(TypeAccount.admin)
  findRolePermissions(@Param('id') id: string) {
    return this.roleService.findRolePermissions(id);
  }

  @Patch(':id')
  @Permissions(PERMISSION_CODES.UPDATE_ROLES)
  @AccountType(TypeAccount.admin)
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.roleService.update(id, updateRoleDto, roleLevel);
  }

  @Delete(':id')
  @Permissions(PERMISSION_CODES.DELETE_ROLES)
  @AccountType(TypeAccount.admin)
  remove(
    @Param('id') id: string,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.roleService.remove(id, roleLevel);
  }

  @Patch(':id/permission')
  @Permissions(PERMISSION_CODES.UPDATE_ROLE_PERMISSIONS)
  @AccountType(TypeAccount.admin)
  updateRolePermissions(
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.roleService.updateRolePermissions(
      id,
      updateRolePermissionsDto,
      roleLevel,
    );
  }
}
