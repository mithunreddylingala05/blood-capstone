import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { BLOOD_GROUPS } from '../../utils/constants'
import DonorCard from '../../components/ui/DonorCard'
import toast from 'react-hot-toast'

const FILTERS = ['All', 'Donors', 'Hospitals', 'Blood Banks']
const SORT_OPTIONS = [
  { key: 'distance', label: 'Distance' },
  { key: 'name', label: 'Name' },
  { key: 'rating', label: 'Rating' },
  { key: 'availability', label: 'Availability' },
]

export default function BloodSearchPage() {
  const { user } = useAuthStore()
  const { nearbyDonors, loading, searchDonors, sortDonorsByName, sortDonorsByDistance, sortDonorsByRating, sortDonorsByAvailability } = useRequestStore()

  const [city, setCity] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('distance')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showSort, setShowSort] = useState(false)

  const doSearch = async (bg = selectedGroup) => {
    if (!city.trim()) { toast.error('Please enter a city or location'); return }
    await searchDonors(bg, city.trim(), user?.latitude, user?.longitude)
    setSearched(true)
  }

  const selectGroup = async (g) => {
    const ng = selectedGroup === g ? null : g
    setSelectedGroup(ng)
    if (searched) await searchDonors(ng, city.trim(), user?.latitude, user?.longitude)
  }

  const applySort = (key) => {
    setSortBy(key)
    setShowSort(false)
    if (key === 'name') sortDonorsByName()
    else if (key === 'distance') sortDonorsByDistance()
    else if (key === 'rating') sortDonorsByRating()
    else if (key === 'availability') sortDonorsByAvailability()
  }

  const filtered = nearbyDonors.filter(d => {
    if (availableOnly && !d.is_available) return false
    if (filter === 'Donors') return d.role === 'donor'
    if (filter === 'Hospitals') return d.role === 'hospital'
    if (filter === 'Blood Banks') return d.role === 'blood_bank'
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary px-5 pt-14 pb-5">
        <h1 className="text-white text-2xl font-black mb-1">Blood Search</h1>
        <p className="text-white/70 text-sm">Find donors, hospitals & blood banks</p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Search bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Enter city or area..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>
          <button onClick={() => doSearch()}
            className="bg-primary text-white px-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors">
            <Search size={17} />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}>
              {f}
            </button>
          ))}
          <button onClick={() => setAvailableOnly(!availableOnly)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${availableOnly ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'}`}>
            ● Available Only
          </button>
        </div>

        {/* Blood group selector */}
        {searched && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Filter by Blood Group</p>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(g => (
                <button key={g} onClick={() => selectGroup(g)}
                  className={`w-14 h-10 rounded-xl text-sm font-black border transition-all ${selectedGroup === g ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-800 border-gray-100'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!searched && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Search size={36} className="text-primary" />
            </div>
            <h3 className="font-black text-gray-800 text-lg mb-2">Search for Blood</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Enter a city or area above to find registered donors and available blood stock near you.
            </p>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-black text-gray-900">{filtered.length} Results Found</p>
              <button onClick={() => setShowSort(true)}
                className="flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1.5 rounded-xl text-xs font-bold">
                <SlidersHorizontal size={13} />
                Sort: {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center">
                <p className="font-bold text-gray-700 mb-1">No Results Found</p>
                <p className="text-gray-400 text-sm">Try a different city or blood group</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((d, i) => (
                  <DonorCard key={d.id} donor={d} isClosest={i === 0} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sort bottom sheet */}
      {showSort && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowSort(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-3xl p-6 w-full max-w-7xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-lg">Sort By</h3>
              <button onClick={() => setShowSort(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => applySort(opt.key)}
                className={`w-full text-left py-3.5 px-4 rounded-xl mb-2 font-semibold text-sm transition-all ${sortBy === opt.key ? 'bg-red-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
                {sortBy === opt.key ? '✓ ' : ''}{opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
