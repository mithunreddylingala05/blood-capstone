import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, X, Filter, Check } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-12 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl font-heading text-slate-900 mb-2">Find Help</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Connected Network of Life Savers</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
        {/* Search Input Card */}
        <div className="bg-white p-2 rounded-[32px] shadow-card border border-slate-100 flex items-center pr-4">
            <div className="flex-1 relative">
                <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSearch()}
                    placeholder="Enter city or area..."
                    className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 placeholder-slate-300 focus:outline-none text-sm font-medium border-0"
                />
            </div>
            <button onClick={() => doSearch()} className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-hero hover:scale-105 transition-all active:scale-95">
                <Search size={22} />
            </button>
        </div>

        {/* Global Filters */}
        <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-subtle' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                    {f}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center justify-between px-1">
                <button onClick={() => setAvailableOnly(!availableOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${availableOnly ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    Available Only
                </button>
                <button onClick={() => setShowSort(true)} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                    <SlidersHorizontal size={14} /> Sort: {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
                </button>
            </div>
        </div>

        {/* Blood Group Quick Select */}
        <div className="px-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Select Blood Group</p>
             <div className="grid grid-cols-4 gap-2">
               {BLOOD_GROUPS.map(g => (
                 <button key={g} onClick={() => selectGroup(g)}
                   className={`h-12 rounded-2xl text-xs font-black border transition-all ${selectedGroup === g ? 'bg-primary text-white border-primary shadow-hero' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}>
                   {g}
                 </button>
               ))}
             </div>
        </div>

        {/* Results Info */}
        {searched && (
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{filtered.length} Local Results</h2>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Searching Network...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-[40px] border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Filter size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No results found for your criteria</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filtered.map((d) => (
                            <DonorCard key={d.id} donor={d} />
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Initial Empty State */}
        {!searched && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <Search size={64} className="text-slate-100 relative z-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-heading text-slate-900 leading-tight">Start Search</h3>
                    <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto">Results will appear here once you enter a location</p>
                </div>
            </div>
        )}
      </div>

      {/* Sort Modal */}
      {showSort && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:pb-8">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowSort(false)} />
            <div className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-hero animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-heading text-slate-900">Sort By</h3>
                    <button onClick={() => setShowSort(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-2">
                    {SORT_OPTIONS.map(opt => (
                        <button key={opt.key} onClick={() => applySort(opt.key)}
                            className={`w-full text-left py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${sortBy === opt.key ? 'bg-primary/5 text-primary border border-primary/10' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}>
                            {opt.label}
                            {sortBy === opt.key && <Check size={18} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
