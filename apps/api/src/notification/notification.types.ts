export type UserNotificationStatus = 'success' | 'failed';

export type UserNotificationEvent =
  | 'order.place'
  | 'order.matched'
  | 'deposit.request'
  | 'withdraw.request'
  | 'deposit.approved'
  | 'deposit.rejected'
  | 'withdraw.approved'
  | 'withdraw.rejected';

export type UserNotificationPayload = {
  id?: string;
  userId: string;
  event: UserNotificationEvent;
  status: UserNotificationStatus;
  title: string;
  message: string;
  createdAt?: string;
  read?: boolean;
  metadata?: Record<string, unknown>;
};
