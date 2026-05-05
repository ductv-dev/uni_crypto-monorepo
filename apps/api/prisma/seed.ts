import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Pool } from 'pg';
import {
  PermissionTableName,
  PrismaClient,
  TypeAccount,
} from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run Prisma seed.');
}

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SUPER_ADMIN_EMAIL =
  process.env.SEED_SUPER_ADMIN_EMAIL ?? 'superadmin@uni-crypto.local';
const SUPER_ADMIN_PASSWORD =
  process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'SuperAdmin@123';

const SUPER_ADMIN_PROFILE = {
  first_name: 'Super',
  last_name: 'Admin',
  gender: 'other',
  phone_number: '+84000000000',
  address: 'Head Office',
  city: 'Ho Chi Minh City',
  country: 'Vietnam',
  date_of_birth: new Date('1995-01-01'),
};

const ROLE_SEEDS = [
  {
    name: 'USER',
    description: 'Default end-user role with the lowest privilege level.',
    level: 5,
  },
  {
    name: 'STAFF',
    description: 'Operational staff role with limited back-office access.',
    level: 4,
  },
  {
    name: 'MANAGER',
    description: 'Manager role with elevated operational permissions.',
    level: 3,
  },
  {
    name: 'ADMIN',
    description: 'Administrator role for platform administration tasks.',
    level: 2,
  },
  {
    name: 'SUPER_ADMIN',
    description: 'System super admin with full access.',
    level: 1,
  },
] as const;

const ASSET_SEEDS = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    description: 'Bitcoin base asset for spot trading.',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    description: 'Ethereum base asset for spot trading.',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    description: 'Stablecoin quote asset for spot markets.',
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    description: 'Exchange utility asset.',
  },
] as const;

const MARKET_SEEDS = [
  {
    symbol: 'BTC/USDT',
    baseSymbol: 'BTC',
    quoteSymbol: 'USDT',
    last_price: '65000',
    high_price_24h: '66500',
    low_price_24h: '64000',
    volume_24h: '125.5000000000',
    min_order_amount: '0.0001000000',
    max_order_amount: '100.0000000000',
    min_order_value: '5.0000000000',
    price_precision: 2,
    quantity_precision: 6,
    description: 'Bitcoin to Tether spot market.',
  },
  {
    symbol: 'ETH/USDT',
    baseSymbol: 'ETH',
    quoteSymbol: 'USDT',
    last_price: '3200',
    high_price_24h: '3290',
    low_price_24h: '3150',
    volume_24h: '890.2500000000',
    min_order_amount: '0.0010000000',
    max_order_amount: '500.0000000000',
    min_order_value: '5.0000000000',
    price_precision: 2,
    quantity_precision: 6,
    description: 'Ethereum to Tether spot market.',
  },
  {
    symbol: 'BNB/USDT',
    baseSymbol: 'BNB',
    quoteSymbol: 'USDT',
    last_price: '580',
    high_price_24h: '595',
    low_price_24h: '560',
    volume_24h: '640.7500000000',
    min_order_amount: '0.0100000000',
    max_order_amount: '1000.0000000000',
    min_order_value: '5.0000000000',
    price_precision: 2,
    quantity_precision: 4,
    description: 'BNB to Tether spot market.',
  },
] as const;

function buildPermissionDefinition(tableName: string) {
  const permissionCode = `manage_${tableName.toLowerCase()}`;

  return {
    tableName,
    permissionCode,
    name: `Manage ${tableName}`,
    description: `Full CRUD permission for ${tableName}.`,
  };
}

async function seedPermissionsAndRole() {
  const roles = await Promise.all(
    ROLE_SEEDS.map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: {
          description: role.description,
          level: role.level,
          status: true,
        },
        create: {
          name: role.name,
          description: role.description,
          level: role.level,
          status: true,
        },
      }),
    ),
  );

  const superAdminRole = roles.find((role) => role.name === 'SUPER_ADMIN');

  if (!superAdminRole) {
    throw new Error('SUPER_ADMIN role could not be seeded.');
  }

  const permissionDefinitions = Object.values(PermissionTableName).map(
    buildPermissionDefinition,
  );

  const permissions = await Promise.all(
    permissionDefinitions.map(({ permissionCode, name, description }) =>
      prisma.permission.upsert({
        where: { permission_code: permissionCode },
        update: {
          name,
          description,
          status: true,
        },
        create: {
          permission_code: permissionCode,
          name,
          description,
          status: true,
        },
      }),
    ),
  );

  await Promise.all(
    permissionDefinitions.map(({ permissionCode, tableName }) =>
      prisma.permissionTableRule.upsert({
        where: {
          permission_code_table_name: {
            permission_code: permissionCode,
            table_name: tableName,
          },
        },
        update: {
          can_create: true,
          can_read: true,
          can_update: true,
          can_delete: true,
        },
        create: {
          permission_code: permissionCode,
          table_name: tableName,
          can_create: true,
          can_read: true,
          can_update: true,
          can_delete: true,
        },
      }),
    ),
  );

  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: superAdminRole.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: superAdminRole.id,
          permission_id: permission.id,
        },
      }),
    ),
  );

  return {
    roles,
    superAdminRole,
  };
}

async function seedAssets() {
  const assets = await Promise.all(
    ASSET_SEEDS.map((asset) =>
      prisma.asset.upsert({
        where: { symbol: asset.symbol },
        update: {
          name: asset.name,
          description: asset.description,
          status: true,
        },
        create: {
          name: asset.name,
          symbol: asset.symbol,
          description: asset.description,
          status: true,
        },
      }),
    ),
  );

  return new Map(assets.map((asset) => [asset.symbol, asset]));
}

async function seedMarkets(assetMap: Map<string, { id: string }>) {
  await Promise.all(
    MARKET_SEEDS.map((market) => {
      const baseAsset = assetMap.get(market.baseSymbol);
      const quoteAsset = assetMap.get(market.quoteSymbol);

      if (!baseAsset || !quoteAsset) {
        throw new Error(
          `Cannot seed market ${market.symbol}: missing base or quote asset.`,
        );
      }

      return prisma.market.upsert({
        where: { symbol: market.symbol },
        update: {
          base_asset_id: baseAsset.id,
          quote_asset_id: quoteAsset.id,
          last_price: market.last_price,
          high_price_24h: market.high_price_24h,
          low_price_24h: market.low_price_24h,
          volume_24h: market.volume_24h,
          min_order_amount: market.min_order_amount,
          max_order_amount: market.max_order_amount,
          min_order_value: market.min_order_value,
          price_precision: market.price_precision,
          quantity_precision: market.quantity_precision,
          description: market.description,
          status: true,
        },
        create: {
          symbol: market.symbol,
          base_asset_id: baseAsset.id,
          quote_asset_id: quoteAsset.id,
          last_price: market.last_price,
          high_price_24h: market.high_price_24h,
          low_price_24h: market.low_price_24h,
          volume_24h: market.volume_24h,
          min_order_amount: market.min_order_amount,
          max_order_amount: market.max_order_amount,
          min_order_value: market.min_order_value,
          price_precision: market.price_precision,
          quantity_precision: market.quantity_precision,
          description: market.description,
          status: true,
        },
      });
    }),
  );
}

async function seedSuperAdmin(
  roleId: string,
  assetMap: Map<string, { id: string }>,
) {
  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      is_active: true,
      is_blocked: false,
      is_super_admin: true,
      type_account: TypeAccount.admin,
      role_id: roleId,
      info: {
        upsert: {
          update: SUPER_ADMIN_PROFILE,
          create: SUPER_ADMIN_PROFILE,
        },
      },
    },
    create: {
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      is_active: true,
      is_blocked: false,
      is_super_admin: true,
      type_account: TypeAccount.admin,
      role_id: roleId,
      info: {
        create: SUPER_ADMIN_PROFILE,
      },
    },
    include: {
      info: true,
    },
  });

  await Promise.all(
    Array.from(assetMap.values()).map((asset) =>
      prisma.wallet.upsert({
        where: {
          user_id_asset_id: {
            user_id: superAdmin.id,
            asset_id: asset.id,
          },
        },
        update: {
          status: true,
        },
        create: {
          user_id: superAdmin.id,
          asset_id: asset.id,
          status: true,
        },
      }),
    ),
  );

  return superAdmin;
}

async function main() {
  const { roles, superAdminRole } = await seedPermissionsAndRole();
  const assetMap = await seedAssets();
  await seedMarkets(assetMap);
  const superAdmin = await seedSuperAdmin(superAdminRole.id, assetMap);

  console.log('Seed completed successfully.');
  console.log(`Super admin email: ${superAdmin.email}`);
  console.log(`Super admin password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Roles seeded: ${roles.map((role) => role.name).join(', ')}`);
  console.log(
    `Permissions granted: ${Object.keys(PermissionTableName).length}`,
  );
  console.log(`Assets seeded: ${ASSET_SEEDS.length}`);
  console.log(`Markets seeded: ${MARKET_SEEDS.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
