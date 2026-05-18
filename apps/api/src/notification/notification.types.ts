export type UserNotificationStatus = 'success' | 'failed';

export type UserNotificationEvent =
  | 'order.place'
  | 'deposit.request'
  | 'withdraw.request'
  | 'deposit.approved'
  | 'deposit.rejected'
  | 'withdraw.approved'
  | 'withdraw.rejected';

export type UserNotificationPayload = {
  userId: string;
  event: UserNotificationEvent;
  status: UserNotificationStatus;
  title: string;
  message: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
};
