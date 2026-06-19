import { create } from 'zustand'
import { dbService } from '../services/dbService'

export const useRequestStore = create((set, get) => ({
  nearbyRequests: [],
  myRequests: [],
  myDonations: [],
  nearbyDonors: [],
  activeContactModal: null,
  loading: false,
  error: null,

  _cleanups: [],

  init(userId, userLat, userLng) {
    // Cancel previous subscriptions
    get()._cleanups.forEach(fn => fn())

    const c1 = dbService.subscribeToNearbyRequests(userLat, userLng, (data) =>
      set({ nearbyRequests: data })
    )

    let c2 = () => {}, c3 = () => {}

    if (userId) {
      c2 = dbService.subscribeToMyRequests(userId, (data) =>
        set({ myRequests: data })
      )
      c3 = dbService.subscribeToMyDonations(userId, (data) =>
        set({ myDonations: data })
      )
    }

    set({ _cleanups: [c1, c2, c3] })
  },

  cleanup() {
    get()._cleanups.forEach(fn => fn())
    set({ _cleanups: [] })
  },

  async createRequest(requestData) {
    set({ loading: true, error: null })
    try {
      await dbService.createBloodRequest(requestData)
      set({ loading: false })
      return true
    } catch (e) {
      set({ loading: false, error: e.message })
      return false
    }
  },

  async updateRequestStatus(requestId, status, acceptedDonorId = null) {
    try {
      await dbService.updateRequestStatus(requestId, status, acceptedDonorId)
    } catch (e) {
      set({ error: e.message })
    }
  },

  async searchDonors(bloodGroup, city, userLat, userLng) {
    set({ loading: true, error: null })
    try {
      const donors = await dbService.getNearbyDonors({ bloodGroup, city, userLat, userLng })
      set({ nearbyDonors: donors, loading: false })
    } catch (e) {
      set({ loading: false, error: e.message })
    }
  },

  sortDonorsByName() {
    set(s => ({ nearbyDonors: [...s.nearbyDonors].sort((a, b) => a.name.localeCompare(b.name)) }))
  },

  sortDonorsByDistance() {
    set(s => ({ nearbyDonors: [...s.nearbyDonors].sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0)) }))
  },

  sortDonorsByRating() {
    set(s => ({ nearbyDonors: [...s.nearbyDonors].sort((a, b) => (b.rating || 0) - (a.rating || 0)) }))
  },

  sortDonorsByAvailability() {
    set(s => ({ nearbyDonors: [...s.nearbyDonors].sort((a, b) => (b.is_available ? 1 : 0) - (a.is_available ? 1 : 0)) }))
  },

  clearError() { set({ error: null }) },
  setActiveContactModal(data) { set({ activeContactModal: data }) },
}))
