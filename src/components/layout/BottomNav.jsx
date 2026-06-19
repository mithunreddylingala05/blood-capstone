import { NavLink } from 'react-router-dom'
import { Home, Search, Siren, Bell, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'

export default function BottomNav() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const isHospital = user?.role === 'hospital' || user?.role === 'blood_bank'

  const navItems = [
    { path: '/home',          icon: Home,  label: 'Home' },
    { path: '/search',        icon: Search, label: 'Search' },
    { path: '/emergency',     icon: Siren, label: isHospital ? 'Inventory' : 'Emergency' },
    { path: '/notifications', icon: Bell,  label: 'Alerts', badge: unreadCount },
    { path: '/profile',       icon: User,  label: 'Account' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-6 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-hero flex items-center justify-around rounded-3xl p-2 w-full max-w-md mx-auto pointer-events-auto">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 w-16
              ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative flex items-center justify-center p-1 rounded-xl transition-all ${isActive ? 'scale-110' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                      {badge > 9 ? '!' : badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>
                  {label}
                </span>
                {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
