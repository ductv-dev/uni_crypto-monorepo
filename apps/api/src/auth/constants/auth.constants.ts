export const IS_PUBLIC_KEY = 'is-public';
export const ACCOUNT_TYPES_KEY = 'account-types';

export const AUTH_ACCOUNT_TYPES = ['user', 'admin'] as const;

export type AuthAccountType = (typeof AUTH_ACCOUNT_TYPES)[number];
