import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { REQUEST_STATUSES } from '../../utils/constants'
import { Heart, MapPin, Clock, ArrowLeft, Award } from 'lucide-react'
import { timeAgo } from '../../utils/time'
import BloodGroupBadge from '../../components/ui/BloodGroupBadge'

export default function MyDonationsPage() {
  const { user } = useAuthStore()
  const { myDonations, init } = useRequestStore()

  useEffect(() => {
    if (user?.id) init(user.id, user?.latitude, user?.longitude)
  }, [user?.id])

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      <div className="bg-green-700 px-5 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/" className="text-white/70"><ArrowLeft size={20} /></Link>
          <h1 className="text-white text-xl font-black">My Donations</h1>
        </div>
        <p className="text-white/70 text-sm">
          You've helped {myDonations.length} time{myDonations.length !== 1 ? 's' : ''} so far 🩸
        </p>
      </div>

      {/* Impact banner */}
      {myDonations.length > 0 && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={24} className="text-green-700" />
          </div>
          <div>
            <p className="font-black text-green-800">{myDonations.length * 3} Lives Potentially Saved</p>
            <p className="text-green-600 text-xs">Each donation can save up to 3 lives</p>
          </div>
        </div>
      )}

      <div className="px-4 py-5 flex flex-col gap-3 pb-24">
        {myDonations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center">
            <Heart size={40} className="text-green-500 mb-3" />
            <p className="font-bold text-gray-700 mb-1">No Donations Yet</p>
            <p className="text-gray-400 text-sm mb-4">Start by helping someone who needs blood</p>
            <Link to="/" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
              View Nearby Requests
            </Link>
          </div>
        ) : (
          myDonations.map(req => {
            const status = REQUEST_STATUSES[req.status] || REQUEST_STATUSES[0]
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <BloodGroupBadge group={req.blood_group} />
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{req.patient_name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={12} />
                  <span>{req.hospital_name}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                  <Clock size={11} />
                  <span>{timeAgo(req.created_at)}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
