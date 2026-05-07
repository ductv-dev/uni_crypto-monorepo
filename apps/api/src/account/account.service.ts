import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  private readonly sortableFields = {
    createdAt: 'u."createdAt"',
    updatedAt: 'u."updatedAt"',
    email: 'u.email',
    type_account: 'u.type_account',
  } as const;

  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}
  async create(
    createAccountDto: CreateAccountDto,
    roleLevel: number,
    userId: string,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { id: createAccountDto.id_role },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (createAccountDto.is_super_admin === true && role.level === 1) {
      throw new UnauthorizedException('Only one super admin is allowed');
    }
    if (role.level <= roleLevel) {
      throw new UnauthorizedException(
        'You cannot assign a role with equal or higher level than yours',
      );
    }
    const emailExists = await this.prisma.user.findUnique({
      where: { email: createAccountDto.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        email: createAccountDto.email,
        password: createAccountDto.password,
        type_account: createAccountDto.type,
        is_super_admin: createAccountDto.is_super_admin,
        is_active: createAccountDto.is_active,
        is_blocked: createAccountDto.is_blocked,
        role_id: createAccountDto.id_role,
      },
    });
    if (!user) {
      throw new ServiceUnavailableException('Failed to create account');
    }
    await this.auditLogService.create({
      user_id: userId,
      action: 'CREATE',
      table_name: 'users',
      record_id: user.id,
      changes: JSON.stringify(createAccountDto),
      ip_address: '127.0.0.1',
    });

    return {
      message: 'Account created successfully',
      data: user,
    };
  }

  async findAll(
    limit: number,
    offset: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    type?: string,
    userId?: string,
  ) {
    const safeLimit = !Number.isFinite(limit)
      ? 10
      : Math.min(Math.max(limit, 1), 100);
    const safeOffset =
      Number.isFinite(offset) && offset >= 0 && offset < safeLimit ? offset : 0;
    const safeSortBy =
      sortBy && sortBy in this.sortableFields ? sortBy : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
    const normalizedSearch = search?.trim();
    const normalizedType = type?.trim();
    const sortColumn =
      this.sortableFields[safeSortBy as keyof typeof this.sortableFields];
    const searchPattern = normalizedSearch ? `%${normalizedSearch}%` : null;
    const searchVectorSql = Prisma.sql`
      to_tsvector(
        'simple',
        concat_ws(
          ' ',
          coalesce(u.email, ''),
          coalesce(u.id, ''),
          coalesce(ui.first_name, ''),
          coalesce(ui.last_name, ''),
          coalesce(ui.phone_number, ''),
          coalesce(ui.address, ''),
          coalesce(ui.city, ''),
          coalesce(ui.country, '')
        )
      )
    `;
    const typeFilterSql = normalizedType
      ? Prisma.sql`u.type_account = ${normalizedType}`
      : Prisma.sql`TRUE`;
    const searchFilterSql =
      normalizedSearch && searchPattern
        ? Prisma.sql`(
            ${searchVectorSql} @@ websearch_to_tsquery('simple', ${normalizedSearch})
            OR u.email ILIKE ${searchPattern}
            OR u.id::text ILIKE ${searchPattern}
            OR coalesce(ui.phone_number, '') ILIKE ${searchPattern}
          )`
        : Prisma.sql`TRUE`;
    const whereSql = Prisma.sql`
      WHERE ${typeFilterSql}
        AND ${searchFilterSql}
    `;
    const orderBySql =
      normalizedSearch && searchPattern
        ? Prisma.sql`
            ORDER BY
              ts_rank_cd(${searchVectorSql}, websearch_to_tsquery('simple', ${normalizedSearch})) DESC,
              ${Prisma.raw(sortColumn)} ${Prisma.raw(safeSortOrder.toUpperCase())},
              u.id ASC
          `
        : Prisma.sql`
            ORDER BY
              ${Prisma.raw(sortColumn)} ${Prisma.raw(safeSortOrder.toUpperCase())},
              u.id ASC
          `;

    const accounts = await this.prisma.$queryRaw<
      { id: string; email: string; type_account: string; createdAt: Date }[]
    >(Prisma.sql`
      SELECT
        u.id,
        u.email,
        u.type_account,
        u."createdAt",
        ui.first_name,
        ui.last_name,
        ui.phone_number,
        u.is_active,
        u.is_blocked,
        ui.address,
        ui.city,
        ui.country

      FROM "User" u
      LEFT JOIN "UserInfo" ui ON ui.user_id = u.id
      ${whereSql}
      ${orderBySql}
      LIMIT ${safeLimit}
      OFFSET ${safeOffset}
    `);
    if (accounts.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          limit: safeLimit,
          offset: safeOffset,
        },
      };
    }
    const [totalResult] = await this.prisma.$queryRaw<
      { total: bigint | number }[]
    >(Prisma.sql`
      SELECT COUNT(*)::bigint AS total
      FROM "User" u
      LEFT JOIN "UserInfo" ui ON ui.user_id = u.id
      ${whereSql}
    `);
    const total = Number(totalResult?.total ?? 0);

    await this.auditLogService.create({
      user_id: userId || '',
      action: 'CREATE',
      table_name: 'users',
      record_id: userId || '',
      changes: 'no changes',
      ip_address: '127.0.0.1',
    });
    return {
      data: accounts,
      meta: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async update(id: string, dto: ChangePasswordDto, roleLevel: number) {
    const user = await this.prisma.user.findMany({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.level <= roleLevel) {
      throw new UnauthorizedException(
        'You cannot assign a role with equal or higher level than yours',
      );
    }

    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
