import { useState } from 'react'
import { X, Navigation, Phone, Heart, Activity } from 'lucide-react'
import { useRequestStore } from '../../store/requestStore'
import { useAuthStore } from '../../store/authStore'
import BloodGroupBadge from './BloodGroupBadge'

export default function ContactModal() {
  const { activeContactModal, setActiveContactModal, updateRequestStatus } = useRequestStore()
  const { user } = useAuthStore()
  
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!activeContactModal) return null

  const { request, requesterProfile } = activeContactModal

  const handleClose = () => {
    setActiveContactModal(null)
    setTimeout(() => setAccepted(false), 300) // reset after fade out (if animated)
  }

  const handleConfirmAccept = async () => {
    setLoading(true)
    await updateRequestStatus(request.id, 1, user.id)
    setLoading(false)
    setAccepted(true)
  }

  const handleGetDirections = () => {
    const lat = request.latitude || requesterProfile?.latitude
    const lng = request.longitude || requesterProfile?.longitude
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
    } else {
      alert("Location coordinates not available.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        <div className="bg-primary px-5 pt-6 pb-12 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-black text-xl flex items-center gap-2">
              <Heart size={20} className="fill-white/20" /> Help Requested!
            </h2>
            <button 
              onClick={handleClose} 
              className="w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-white/80 text-sm">Please review the details below.</p>
        </div>

        <div className="px-5 pb-6 -mt-6 relative z-10 bg-white rounded-t-3xl pt-6 flex flex-col gap-5">
          {/* Patient Details */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
            <BloodGroupBadge group={request.blood_group} />
            <div>
              <p className="font-bold text-gray-900">{request.patient_name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{request.hospital_name}</p>
            </div>
          </div>

          {!accepted ? (
            <div className="flex flex-col gap-3">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-2">
                <div className="flex items-start gap-3">
                  <Activity size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-orange-900 text-sm mb-1">Confirm Your Donation</h3>
                    <p className="text-orange-700/80 text-xs leading-relaxed">
                      By accepting, you commit to donating blood for this request. Contacting details will be available after confirmation.
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleConfirmAccept} 
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Yes, I will donate'}
              </button>
              <button 
                onClick={handleClose}
                className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                <p className="font-black text-green-700 text-lg mb-1">Thank You! 🦸‍♂️</p>
                <p className="text-green-600/80 text-xs">The requester has been notified.</p>
              </div>

              {/* Requester Contact details */}
              <div className="border border-gray-100 rounded-2xl p-4 mt-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Requester Details</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-gray-600">{requesterProfile?.name?.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{requesterProfile?.name || 'Unknown'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Contact Person</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {requesterProfile?.phone && (
                    <a 
                      href={`tel:${requesterProfile.phone}`}
                      className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Phone size={16} /> Call Now
                    </a>
                  )}
                  
                  <button 
                    onClick={handleGetDirections}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Navigation size={16} /> Directions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
