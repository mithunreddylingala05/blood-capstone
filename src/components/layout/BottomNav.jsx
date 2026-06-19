import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Siren, Bell, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'

export default function BottomNav() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const isHospital = user?.role === 'hospital' || user?.role === 'blood_bank'

  const navItems = [
    { path: '/',              icon: Home,  label: 'Home' },
    { path: '/search',        icon: Search, label: 'Search' },
    { path: '/emergency',     icon: Siren, label: isHospital ? 'Inventory' : 'SOS' },
    { path: '/notifications', icon: Bell,  label: 'Alerts', badge: unreadCount },
    { path: '/profile',       icon: User,  label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-2xl border-2 border-primary/10 shadow-[0_12px_40px_-10px_rgba(225,29,72,0.3)] flex items-center justify-between rounded-[32px] px-4 py-2 w-full max-w-4xl mx-auto pointer-events-auto">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isEmergency = path === '/emergency';
          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `relative flex-1 flex flex-col items-center py-2 gap-1 text-[10px] font-bold transition-all duration-300
                ${isActive ? 'text-primary scale-110' : 'text-slate-400 hover:text-primary/70'}
                ${isEmergency && !isActive ? 'text-rose-500 hover:text-rose-600 hover:scale-105' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300 ${isActive ? (isEmergency ? 'bg-rose-500 text-white shadow-md' : 'bg-primary/10') : (isEmergency ? 'bg-rose-50 shadow-sm animate-pulse-soft' : '')}`}>
                    <Icon size={isActive || isEmergency ? 24 : 22} strokeWidth={isActive || isEmergency ? 2.5 : 2} />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 border-2 border-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none shadow-sm">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </div>
                  <span className={`transition-all duration-300 ${isActive || isEmergency ? 'opacity-100 translate-y-0 text-[11px]' : 'opacity-70 -translate-y-1'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  )
}
