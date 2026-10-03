/**
 * ============================================================================
 * NOTIFICATION TYPES
 * ============================================================================
 */

export type NotificationType =
  | "payment"
  | "order"
  | "product"
  | "settlement"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
