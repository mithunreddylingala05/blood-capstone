import { supabase } from '../lib/supabase'

export const authService = {
  async register({ name, email, password, phone, bloodGroup, location, city, state, role }) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      phone,
      email,
      blood_group: bloodGroup,
      location,
      city,
      state,
      role,
      is_available: true,
      total_donations: 0,
      rating: 0.0,
    })
    if (profileError) throw profileError
    return data.user
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    if (error) throw error
  },

  async updateAvailability(userId, isAvailable) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_available: isAvailable })
      .eq('id', userId)
    if (error) throw error
  },

  async updateLocation(userId, lat, lng) {
    const { error } = await supabase
      .from('profiles')
      .update({ latitude: lat, longitude: lng })
      .eq('id', userId)
    if (error) throw error
  },

  async updateBloodStock(userId, bloodStock) {
    const { error } = await supabase
      .from('profiles')
      .update({ blood_stock: bloodStock })
      .eq('id', userId)
    if (error) throw error
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
