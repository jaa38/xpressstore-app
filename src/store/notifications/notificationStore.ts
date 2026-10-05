import { create } from "zustand";

import { getMockNotifications } from "@/mocks/notifications";

import { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];

  setNotifications: (notifications: Notification[]) => void;

  markAsRead: (notificationId: string) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;

  resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: getMockNotifications(),

  setNotifications: (notifications) => {
    set({
      notifications,
    });
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    }));
  },

  clearNotifications: () => {
    set({
      notifications: [],
    });
  },

  resetNotifications: () => {
    set({
      notifications: getMockNotifications(),
    });
  },
}));
