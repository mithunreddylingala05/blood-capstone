import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { REQUEST_STATUSES, URGENCY_LEVELS } from '../../utils/constants'
import { MapPin, Droplets, Clock, ArrowLeft, Heart } from 'lucide-react'
import { timeAgo } from '../../utils/time'
import { Link } from 'react-router-dom'
import BloodGroupBadge from '../../components/ui/BloodGroupBadge'

export default function MyRequestsPage() {
  const { user } = useAuthStore()
  const { myRequests, init } = useRequestStore()

  useEffect(() => {
    if (user?.id) init(user.id, user?.latitude, user?.longitude)
  }, [user?.id])

  const statusInfo = (status) => REQUEST_STATUSES[status] || REQUEST_STATUSES[0]
  const urgencyInfo = (urgency) => URGENCY_LEVELS[urgency] || URGENCY_LEVELS[2]

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-12 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
            <Link to="/home" className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-primary transition-colors">
              <ArrowLeft size={16} /> Back 
            </Link>
            <h1 className="text-3xl font-heading text-slate-900 mb-2">My Requests</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">History of SOS Broadcasts</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10 space-y-4 animate-fade-in">
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-slate-100 p-12 flex flex-col items-center text-center shadow-card">
            <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mb-6">
                <Heart size={32} className="text-slate-200" />
            </div>
            <p className="text-lg font-heading text-slate-900 mb-2">No Requests Yet</p>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">When you post an emergency request, it will appear here.</p>
            <Link to="/emergency" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-hero hover:bg-rose-700 transition-all">
              Broadcast Emergency
            </Link>
          </div>
        ) : (
          myRequests.map(req => {
            const status = statusInfo(req.status)
            const urgency = urgencyInfo(req.urgency)
            return (
              <div key={req.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-card hover:border-primary/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <BloodGroupBadge group={req.blood_group} size="lg" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${status.color.replace('text', 'border')} ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-heading text-slate-900">{req.patient_name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      <MapPin size={12} className="text-slate-300" />
                      <span className="truncate">{req.hospital_name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                    <Droplets size={12} className="text-primary" />
                    {req.units_required} Units
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase" style={{ color: urgency.color }}>
                    <span>{urgency.emoji}</span> {urgency.label}
                  </div>
                  <div className="flex-1 flex justify-end items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    <Clock size={12} /> {timeAgo(req.created_at)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
