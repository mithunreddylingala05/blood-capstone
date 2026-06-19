import { create } from 'zustand'
import { dbService } from '../services/dbService'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  _cleanup: null,

  startListening(userId) {
    if (get()._cleanup) get()._cleanup()

    const cleanup = dbService.subscribeToNotifications(userId, (notifs) => {
      set({
        notifications: notifs,
        unreadCount: notifs.filter(n => !n.is_read).length,
      })
    })

    set({ _cleanup: cleanup })
  },

  stopListening() {
    if (get()._cleanup) get()._cleanup()
    set({ _cleanup: null })
  },

  async markRead(notifId) {
    await dbService.markNotificationRead(notifId)
    set(s => ({
      notifications: s.notifications.map(n => n.id === notifId ? { ...n, is_read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }))
  },

  async markAllRead(userId) {
    await dbService.markAllNotificationsRead(userId)
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0,
    }))
  },
}))
