import { supabase } from '../lib/supabase'
import { distanceKm } from '../utils/distance'

export const dbService = {
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) throw error
    return data
  },

  // ─── BLOOD REQUESTS ────────────────────────────────────────────

  async createBloodRequest(request) {
    const { data, error } = await supabase
      .from('blood_requests')
      .insert(request)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async fetchNearbyRequests(userLat, userLng, radiusKm = 50) {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 0)
      .order('created_at', { ascending: false })
    if (error) throw error

    return data.map(r => ({
      ...r,
      distance_km: (r.latitude && userLat)
        ? distanceKm(userLat, userLng, r.latitude, r.longitude)
        : null,
    })).filter(r => !r.distance_km || r.distance_km <= radiusKm)
  },

  subscribeToNearbyRequests(userLat, userLng, callback) {
    const channel = supabase
      .channel('nearby-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, async () => {
        const data = await dbService.fetchNearbyRequests(userLat, userLng)
        callback(data)
      })
      .subscribe()

    dbService.fetchNearbyRequests(userLat, userLng).then(callback)
    return () => supabase.removeChannel(channel)
  },

  async getMyRequests(userId) {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('requested_by', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  subscribeToMyRequests(userId, callback) {
    const channel = supabase
      .channel(`my-requests-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests', filter: `requested_by=eq.${userId}` }, async () => {
        const data = await dbService.getMyRequests(userId)
        callback(data)
      })
      .subscribe()

    dbService.getMyRequests(userId).then(callback)
    return () => supabase.removeChannel(channel)
  },

  async getMyDonations(userId) {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('accepted_donor_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  subscribeToMyDonations(userId, callback) {
    const channel = supabase
      .channel(`my-donations-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests', filter: `accepted_donor_id=eq.${userId}` }, async () => {
        const data = await dbService.getMyDonations(userId)
        callback(data)
      })
      .subscribe()

    dbService.getMyDonations(userId).then(callback)
    return () => supabase.removeChannel(channel)
  },

  async updateRequestStatus(requestId, status, acceptedDonorId = null) {
    const update = { status }
    if (acceptedDonorId) update.accepted_donor_id = acceptedDonorId
    const { error } = await supabase
      .from('blood_requests')
      .update(update)
      .eq('id', requestId)
    if (error) throw error
  },

  async incrementTotalDonations(userId) {
    const { data } = await supabase.from('profiles').select('total_donations').eq('id', userId).single()
    await supabase.from('profiles').update({ total_donations: (data?.total_donations || 0) + 1 }).eq('id', userId)
  },

  // ─── DONORS / SEARCH ────────────────────────────────────────────

  async getNearbyDonors({ bloodGroup, city, userLat, userLng }) {
    let query = supabase.from('profiles').select('*').in('role', ['donor', 'hospital', 'blood_bank'])
    if (bloodGroup && bloodGroup !== 'All') {
      query = query.eq('blood_group', bloodGroup)
    }

    const { data, error } = await query
    if (error) throw error

    const filtered = data.filter(d => {
      const matchCity = d.city?.toLowerCase() === city.toLowerCase() ||
        d.location?.toLowerCase().includes(city.toLowerCase())
      const nearRadius = userLat && d.latitude
        ? distanceKm(userLat, userLng, d.latitude, d.longitude) <= 50
        : false
      if (d.role === 'hospital' || d.role === 'blood_bank') {
        if (bloodGroup && bloodGroup !== 'All') {
          const stock = d.blood_stock || {}
          if ((stock[bloodGroup] || 0) <= 0) return false
        }
      }
      return matchCity || nearRadius
    }).map(d => ({
      ...d,
      distance_km: (userLat && d.latitude)
        ? distanceKm(userLat, userLng, d.latitude, d.longitude)
        : 0,
    }))

    return filtered.sort((a, b) => a.distance_km - b.distance_km)
  },

  async getUsersByState(state) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('state', state)
      .order('city')
    if (error) throw error
    return data
  },

  // ─── NOTIFICATIONS ──────────────────────────────────────────────

  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  subscribeToNotifications(userId, callback) {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, async () => {
        const data = await dbService.getNotifications(userId)
        callback(data)
      })
      .subscribe()

    dbService.getNotifications(userId).then(callback)
    return () => supabase.removeChannel(channel)
  },

  async markNotificationRead(notifId) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notifId)
  },

  async markAllNotificationsRead(userId) {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
  },

  async createNotification({ userId, title, message, type = 2, metadata = null }) {
    await supabase.from('notifications').insert({ user_id: userId, title, message, type, metadata })
  },

  // ─── ADMIN STATS ────────────────────────────────────────────────

  async getAdminStats() {
    const [donors, requests, hospitals] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'donor'),
      supabase.from('blood_requests').select('*', { count: 'exact', head: true }).eq('status', 0),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hospital'),
    ])
    return {
      totalDonors: donors.count || 0,
      activeRequests: requests.count || 0,
      hospitals: hospitals.count || 0,
    }
  },
}
