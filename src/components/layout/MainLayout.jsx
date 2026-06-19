import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full relative">
      <main className="flex-1 pb-20 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
