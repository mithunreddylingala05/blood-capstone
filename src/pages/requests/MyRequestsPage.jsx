import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { REQUEST_STATUSES, URGENCY_LEVELS } from '../../utils/constants'
import { MapPin, Droplets, Clock, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      <div className="bg-primary px-5 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/" className="text-white/70"><ArrowLeft size={20} /></Link>
          <h1 className="text-white text-xl font-black">My Requests</h1>
        </div>
        <p className="text-white/70 text-sm">Blood requests you've posted</p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-3 pb-24">
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center">
            <Droplets size={40} className="text-primary mb-3" />
            <p className="font-bold text-gray-700 mb-1">No Requests Yet</p>
            <p className="text-gray-400 text-sm mb-4">Your blood requests will appear here</p>
            <Link to="/emergency" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
              Post Emergency Request
            </Link>
          </div>
        ) : (
          myRequests.map(req => {
            const status = statusInfo(req.status)
            const urgency = urgencyInfo(req.urgency)
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <BloodGroupBadge group={req.blood_group} />
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{req.patient_name}</h3>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                  <MapPin size={12} />
                  <span>{req.hospital_name}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Droplets size={11} /> {req.units_required} units
                  </span>
                  <span style={{ color: urgency.color }} className="font-semibold">
                    {urgency.emoji} {urgency.label}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Clock size={11} /> {timeAgo(req.created_at)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
