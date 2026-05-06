export const PERMISSION_ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const PERMISSION_RESOURCE_NAMES = {
  User: 'users',
  UserInfo: 'user_infos',
  Role: 'roles',
  Permission: 'permissions',
  RolePermission: 'role_permissions',
  Session: 'sessions',
  AuditLog: 'audit_logs',
  Asset: 'assets',
  Wallet: 'wallets',
  WalletTransaction: 'wallet_transactions',
  Market: 'markets',
  OrderBook: 'order_books',
  Trade: 'trades',
  DepositWithdrawal: 'deposit_withdrawals',
} as const;

export type PermissionTableName = keyof typeof PERMISSION_RESOURCE_NAMES;
export type PermissionResourceName =
  (typeof PERMISSION_RESOURCE_NAMES)[PermissionTableName];
export type PermissionCodeConstantKey =
  `${Uppercase<PermissionAction>}_${Uppercase<PermissionResourceName>}`;

export const ALL_PERMISSION_TABLES = Object.keys(
  PERMISSION_RESOURCE_NAMES,
) as PermissionTableName[];

const PERMISSION_ACTION_PREFIXES: Record<
  PermissionAction,
  Uppercase<PermissionAction>
> = {
  read: 'READ',
  create: 'CREATE',
  update: 'UPDATE',
  delete: 'DELETE',
};

export function buildPermissionCode(
  tableName: PermissionTableName,
  action: PermissionAction,
): string {
  return `${PERMISSION_RESOURCE_NAMES[tableName]}.${action}`;
}

function buildPermissionConstantKey(
  tableName: PermissionTableName,
  action: PermissionAction,
): PermissionCodeConstantKey {
  const resourceName = PERMISSION_RESOURCE_NAMES[tableName].toUpperCase();
  return `${PERMISSION_ACTION_PREFIXES[action]}_${resourceName}` as PermissionCodeConstantKey;
}

export const PERMISSION_CODES = Object.freeze(
  Object.fromEntries(
    ALL_PERMISSION_TABLES.flatMap((tableName) =>
      PERMISSION_ACTIONS.map((action) => [
        buildPermissionConstantKey(tableName, action),
        buildPermissionCode(tableName, action),
      ]),
    ),
  ),
) as Record<PermissionCodeConstantKey, string>;
