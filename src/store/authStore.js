import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  init() {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id)
          set({ user: profile, session, loading: false })
          // Update location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
              await authService.updateLocation(session.user.id, pos.coords.latitude, pos.coords.longitude)
            })
          }
        } catch {
          set({ loading: false })
        }
      } else {
        set({ loading: false })
      }
    })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id)
          set({ user: profile, session })
        } catch {
          set({ user: null, session: null })
        }
      } else {
        set({ user: null, session: null })
      }
    })
  },

  async login(email, password) {
    set({ error: null })
    try {
      await authService.login(email, password)
      return true
    } catch (e) {
      set({ error: e.message })
      return false
    }
  },

  async register(data) {
    set({ error: null })
    try {
      await authService.register(data)
      return true
    } catch (e) {
      set({ error: e.message })
      return false
    }
  },

  async logout() {
    await authService.logout()
    set({ user: null, session: null })
  },

  async updateProfile(updates) {
    const { user } = get()
    if (!user) return
    try {
      await authService.updateProfile(user.id, updates)
      const updated = await authService.getProfile(user.id)
      set({ user: updated })
    } catch (e) {
      set({ error: e.message })
    }
  },

  async toggleAvailability(value) {
    const { user } = get()
    if (!user) return
    const newVal = value !== undefined ? value : !user.is_available
    set({ user: { ...user, is_available: newVal } })
    try {
      await authService.updateAvailability(user.id, newVal)
    } catch {
      set({ user: { ...user, is_available: !newVal } })
    }
  },

  async updateBloodStock(bloodStock) {
    const { user } = get()
    if (!user) return
    try {
      await authService.updateBloodStock(user.id, bloodStock)
      const updated = await authService.getProfile(user.id)
      set({ user: updated })
    } catch (e) {
      set({ error: e.message })
    }
  },

  clearError() { set({ error: null }) },
}))
