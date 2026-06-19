import { useState } from 'react'
import { MapPin, Phone, Droplets, Clock } from 'lucide-react'
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
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <BloodGroupBadge group={request.blood_group} />
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{timeAgo(request.created_at)}</span>
        </div>

        <h3 className="font-black text-slate-800 text-lg mb-1 group-hover:text-primary transition-colors">{request.patient_name}</h3>

        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-1.5 font-medium">
          <MapPin size={14} className="text-primary/70" />
          <span className="truncate">{request.hospital_name}</span>
        </div>

        {request.distance_km != null && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4 bg-slate-50 w-fit px-2 py-1 rounded-lg">
            <span>{fmtDist(request.distance_km)} away</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 bg-rose-50/50 px-3 py-1.5 rounded-xl border border-rose-100/50">
            <Droplets size={14} className="text-primary" />
            {request.units_required} unit{request.units_required > 1 ? 's' : ''} req.
          </span>

          {canAccept && (
            <button
              onClick={handleIntendToDonate}
              disabled={loading}
              className="bg-primary text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_12px_rgba(225,29,72,0.25)] hover:shadow-[0_6px_16px_rgba(225,29,72,0.35)] disabled:opacity-50 disabled:hover:shadow-none hover:-translate-y-0.5"
            >
              {loading ? 'Wait...' : "I'll Donate"}
            </button>
          )}

          {isOwner && (
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50 shadow-sm">Your Request</span>
          )}
        </div>
      </div>
    </div>
  )
}
