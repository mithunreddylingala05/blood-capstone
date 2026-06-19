import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useRequestStore } from '../../store/requestStore'
import { Bell, CheckCheck, Droplets, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { timeAgo } from '../../utils/time'
import toast from 'react-hot-toast'

const typeConfig = [
  { icon: AlertCircle, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  { icon: Info,        color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
]

function NotifCard({ notif, onRead }) {
  const cfg = typeConfig[notif.type] || typeConfig[2]
  const Icon = cfg.icon

  return (
    <div
      onClick={() => !notif.is_read && onRead(notif.id)}
      className={`rounded-2xl border p-4 transition-all cursor-pointer ${notif.is_read ? 'bg-white border-gray-100 opacity-70' : `${cfg.bg} ${cfg.border}`}`}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-bold text-sm ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</p>
            {!notif.is_read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
          </div>
          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
          <p className="text-gray-400 text-xs mt-1.5">{timeAgo(notif.created_at)}</p>
        </div>
      </div>
    </div>
  )
}

function BloodAlertCard({ request }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
          <Droplets size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">🩸 {request.blood_group} Needed Urgently</p>
          <p className="text-gray-600 text-xs mt-0.5">
            {request.hospital_name} needs {request.units_required} unit{request.units_required > 1 ? 's' : ''} for {request.patient_name}
          </p>
          <p className="text-gray-400 text-xs mt-1.5">{timeAgo(request.created_at)}</p>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const { notifications, unreadCount, startListening, markRead, markAllRead } = useNotificationStore()
  const { nearbyRequests } = useRequestStore()

  useEffect(() => {
    if (user?.id) startListening(user.id)
  }, [user?.id])

  const handleMarkAllRead = async () => {
    if (!user?.id) return
    await markAllRead(user.id)
    toast.success('All marked as read')
  }

  // Combine blood alerts + regular notifs
  const allItems = [
    ...nearbyRequests.slice(0, 5).map(r => ({ type: 'blood', data: r })),
    ...notifications.map(n => ({ type: 'notif', data: n })),
  ]

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-primary px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-black">Emergency Alerts</h1>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
        </div>
        {/* Stats */}
        <div className="flex">
          <div className="flex-1 text-center">
            <p className="text-white text-2xl font-black">{nearbyRequests.length}</p>
            <p className="text-white/60 text-xs">Active Requests</p>
          </div>
          <div className="w-px bg-white/20 mx-4" />
          <div className="flex-1 text-center">
            <p className="text-white text-2xl font-black">{unreadCount}</p>
            <p className="text-white/60 text-xs">Unread Alerts</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-3 pb-24">
        {allItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={28} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-700 mb-1">All Clear!</p>
            <p className="text-gray-400 text-sm">No emergency alerts at the moment</p>
          </div>
        ) : (
          allItems.map((item, i) =>
            item.type === 'blood'
              ? <BloodAlertCard key={`blood-${item.data.id}`} request={item.data} />
              : <NotifCard key={item.data.id} notif={item.data} onRead={markRead} />
          )
        )}
      </div>
    </div>
  )
}
