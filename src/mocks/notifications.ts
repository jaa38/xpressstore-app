import { Notification } from "@/types/notification";

/**
 * ============================================================================
 * NOTIFICATION MOCKS
 * ============================================================================
 */

/**
 * ---------------------------------------------------------------------------
 * Mock Notifications
 * ---------------------------------------------------------------------------
 */

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notification-001",
    type: "payment",
    title: "Payment received",
    message:
      "You received a payment of ₦25,000.00 from a customer through your store.",
    createdAt: "2026-10-03T18:45:00.000Z",
    isRead: false,
  },
  {
    id: "notification-002",
    type: "order",
    title: "New order received",
    message:
      "A new order has been placed on your XpressStore. Review the order to start processing it.",
    createdAt: "2026-10-03T16:30:00.000Z",
    isRead: false,
  },
  {
    id: "notification-003",
    type: "settlement",
    title: "Settlement completed",
    message:
      "Your settlement of ₦85,500.00 has been successfully processed and sent to your settlement account.",
    createdAt: "2026-10-03T12:15:00.000Z",
    isRead: true,
  },
  {
    id: "notification-004",
    type: "product",
    title: "Product updated",
    message: "Your product \"Premium Subscription\" was successfully updated.",
    createdAt: "2026-10-02T15:20:00.000Z",
    isRead: true,
  },
  {
    id: "notification-005",
    type: "system",
    title: "Store profile completed",
    message:
      "Your store profile is now complete. You can continue adding products and accepting payments.",
    createdAt: "2026-10-01T10:00:00.000Z",
    isRead: true,
  },
];

/**
 * ============================================================================
 * GET NOTIFICATIONS
 * ============================================================================
 */

export function getMockNotifications(): Notification[] {
  return [...MOCK_NOTIFICATIONS];
}
