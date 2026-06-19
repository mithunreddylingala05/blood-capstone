import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Droplets, Heart, Activity, ChevronRight, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { useNotificationStore } from '../../store/notificationStore'
import BloodRequestCard from '../../components/ui/BloodRequestCard'
import { initials } from '../../utils/time'

export default function HomePage() {
  const { user } = useAuthStore()
  const { nearbyRequests, myRequests, myDonations, init } = useRequestStore()
  const { unreadCount, startListening } = useNotificationStore()

  useEffect(() => {
    init(user?.id, user?.latitude, user?.longitude)
    if (user?.id) startListening(user.id)
  }, [user?.id])

  const isHospital = user?.role === 'hospital' || user?.role === 'blood_bank'
  const latestRequest = myRequests[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-rose-900 px-6 pt-16 pb-12 relative overflow-hidden shadow-primary rounded-b-[40px] mb-6">
        <Droplets size={160} className="absolute -right-8 -top-8 text-white/5 rotate-12 blur-sm" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div>
            <p className="text-rose-100 text-sm font-medium tracking-wide mb-1">Good day,</p>
            <h1 className="text-white text-3xl font-black tracking-tight">{user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-rose-200 text-xs mt-1 font-medium">{user?.city}, {user?.state}</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.blood_group && (
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-glass">
                <span className="text-white font-black text-sm">{user.blood_group}</span>
              </div>
            )}
            <Link to="/notifications" className="relative group">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-glass group-hover:bg-white/30 transition-all duration-300">
                <Bell size={20} className="text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-bounce">{unreadCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 relative z-10">
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-center shadow-glass transition-transform duration-300 hover:-translate-y-1">
            <p className="text-white text-2xl font-black mb-1">{myDonations.length}</p>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Donations</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-center shadow-glass transition-transform duration-300 hover:-translate-y-1">
            <p className="text-white text-2xl font-black mb-1">{myRequests.length}</p>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Requests</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-center shadow-glass transition-transform duration-300 hover:-translate-y-1">
            <p className="text-white text-2xl font-black mb-1">{nearbyRequests.length}</p>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Nearby SOS</p>
          </div>
        </div>
      </div>

        <div className="px-5 py-2 flex flex-col gap-6">
        {/* Active request banner */}
        {latestRequest && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/50 rounded-3xl p-5 shadow-soft hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-orange-600 animate-pulse" />
              <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">Active Request</span>
            </div>
            <p className="text-gray-900 text-base font-bold mb-1">{latestRequest.patient_name} <span className="text-orange-600">— {latestRequest.blood_group}</span></p>
            <p className="text-gray-500 text-xs font-medium">{latestRequest.hospital_name}</p>
            <Link to="/my-requests" className="mt-4 text-orange-600 text-xs font-bold flex items-center gap-1 group">
              View Status <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Emergency Request CTA */}
        {!isHospital && (
          <Link to="/emergency" className="relative group block rounded-[32px] overflow-hidden shadow-[0_16px_40px_-10px_rgba(225,29,72,0.5)] transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-primary opacity-100 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute top-0 right-0 p-12 bg-white opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="relative p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-soft border-4 border-rose-100">
                <AlertCircle size={32} className="text-primary transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <p className="text-white font-black text-2xl tracking-tight uppercase drop-shadow-md">Emergency SOS</p>
                </div>
                <p className="text-rose-100 text-sm font-semibold tracking-wide">Broadcast urgent blood request instantly</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                 <ChevronRight size={24} className="text-white mix-blend-luminosity" />
              </div>
            </div>
          </Link>
        )}

        {/* Nearby Requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-800 text-xl tracking-tight">Emergency Requests</h2>
            <Link to="/my-requests" className="text-primary text-xs font-bold flex items-center gap-1 hover:text-primary-dark transition-colors">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {nearbyRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 flex flex-col items-center text-center shadow-soft">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-soft">
                <Heart size={36} className="text-primary animate-pulse-soft" />
              </div>
              <p className="font-bold text-slate-800 text-lg mb-2">No Active Requests</p>
              <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">All is calm nearby. We'll notify you when someone needs help.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {nearbyRequests.slice(0, 3).map((r, i) => (
                <div key={r.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <BloodRequestCard request={r} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-black text-slate-800 text-xl tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/search" className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-3 shadow-soft hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                <Droplets size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-base">Find Donors</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Search nearby donors</p>
              </div>
            </Link>
            <Link to="/my-donations" className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-3 shadow-soft hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Heart size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-base">My Impact</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Track your donations</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
