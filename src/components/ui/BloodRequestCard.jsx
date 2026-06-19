import { useState } from 'react'
import { MapPin, Droplets } from 'lucide-react'
import UrgencyBadge from './UrgencyBadge'
import BloodGroupBadge from './BloodGroupBadge'
import { timeAgo } from '../../utils/time'
import { formatDistance as fmtDist } from '../../utils/distance'
import { useRequestStore } from '../../store/requestStore'
import { useAuthStore } from '../../store/authStore'
import { dbService } from '../../services/dbService'

export default function BloodRequestCard({ request, onAccept }) {
  const { user } = useAuthStore()
  const { setActiveContactModal } = useRequestStore()
  
  const [loading, setLoading] = useState(false)

  const handleIntendToDonate = async () => {
    if (!user) return
    setLoading(true)
    try {
      const profile = await dbService.getProfile(request.requested_by)
      setActiveContactModal({ request, requesterProfile: profile })
      onAccept?.()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const isOwner = user?.id === request.requested_by
  const canAccept = !isOwner && request.status === 0 && user?.role === 'donor'

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-card hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <BloodGroupBadge group={request.blood_group} />
          <UrgencyBadge urgency={request.urgency} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{timeAgo(request.created_at)}</span>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-heading text-slate-900 leading-tight">{request.patient_name}</h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
          <MapPin size={14} className="text-slate-300" />
          <span className="truncate">{request.hospital_name}</span>
        </div>
        {request.distance_km != null && (
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{fmtDist(request.distance_km)} away</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-600">
          <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary">
            <Droplets size={16} />
          </div>
          <span className="text-sm font-bold">{request.units_required} Units</span>
        </div>

        {canAccept && (
          <button
            onClick={handleIntendToDonate}
            disabled={loading}
            className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-2xl hover:bg-primary-dark transition-all shadow-subtle disabled:opacity-50"
          >
            {loading ? '...' : "Help Now"}
          </button>
        )}

        {isOwner && (
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Your Request</span>
        )}
      </div>
    </div>
  )
}
