import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { CreatePermissionDTO } from './dto';
import { GetAllPermissionsDto } from './dto/get-all-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: GetAllPermissionsDto) {
    const limit = this.parseLimit(dto.limit);
    const offset = this.parseOffset(dto.offset);

    const data = await this.prisma.permission.findMany({
      skip: offset,
      take: limit,
    });
    const total = await this.prisma.permission.count();
    const totalPages = Math.ceil(total / limit);
    const result = {
      data: data,
      pagination: {
        total,
        totalPages,
        limit,
        offset,
      },
    };
    return result;
  }

  private parseLimit(value: number | string | undefined): number {
    const parsedValue = Number(value ?? 10);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      return 10;
    }

    return Math.min(parsedValue, 100);
  }

  private parseOffset(value: number | string | undefined): number {
    const parsedValue = Number(value ?? 0);

    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      return 0;
    }

    return parsedValue;
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: id,
      },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async updateStatus(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: id,
      },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    const updatedPermission = await this.prisma.permission.update({
      where: {
        id: id,
      },
      data: {
        status: !permission.status,
      },
    });
    if (!updatedPermission) {
      throw new Error('Failed to update permission status');
    }
    return {
      message: 'Permission status updated successfully',
      data: updatedPermission,
    };
  }
  async create(dto: CreatePermissionDTO) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: {
        permission_code: dto.permission_code,
      },
    });
    if (existingPermission) {
      throw new ConflictException('Permission already exists');
    }
    const permission = await this.prisma.permission.create({
      data: {
        permission_code: dto.permission_code,
        name: dto.name,
        description: dto.description,
      },
    });
    return permission;
  }
}
