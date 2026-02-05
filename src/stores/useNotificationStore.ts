import { create } from "zustand";

export interface Notification {
  type: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
  txid?: string;
}

interface NotificationStore {
  notifications: Notification[];
  notify: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  notify: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification].slice(-10),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
