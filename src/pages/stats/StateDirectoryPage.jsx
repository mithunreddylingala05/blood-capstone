import { useState } from 'react'
import { ArrowLeft, MapPin, Users, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INDIAN_STATES } from '../../utils/constants'
import { dbService } from '../../services/dbService'
import DonorCard from '../../components/ui/DonorCard'

export default function StateDirectoryPage() {
  const [selectedState, setSelectedState] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const loadState = async (state) => {
    setSelectedState(state)
    setLoading(true)
    try {
      const data = await dbService.getUsersByState(state)
      setUsers(data)
    } catch {
      setUsers([])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      <div className="bg-primary px-5 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/profile" className="text-white/70"><ArrowLeft size={20} /></Link>
          <h1 className="text-white text-xl font-black">State Directory</h1>
        </div>
        <p className="text-white/70 text-sm">Browse donors and hospitals by state</p>
      </div>

      <div className="px-4 py-5 pb-24">
        {!selectedState ? (
          <div className="flex flex-col gap-2">
            {INDIAN_STATES.map(state => (
              <button key={state} onClick={() => loadState(state)}
                className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={15} className="text-primary" />
                </div>
                <span className="font-semibold text-gray-800 flex-1 text-sm text-left">{state}</span>
                <ChevronRight size={15} className="text-gray-300" />
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => { setSelectedState(''); setUsers([]) }}
              className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
              <ArrowLeft size={15} /> Back to States
            </button>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">{selectedState}</h2>
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Users size={12} /> {users.length} found
              </span>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <p className="font-bold text-gray-700 mb-1">No Users Found</p>
                <p className="text-gray-400 text-sm">No registered donors in {selectedState} yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {users.map(u => <DonorCard key={u.id} donor={u} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
