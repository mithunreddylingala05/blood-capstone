import { useEffect, useState } from 'react'
import { dbService } from '../../services/dbService'
import { BLOOD_GROUPS } from '../../utils/constants'
import { Users, Activity, Hospital, TrendingUp } from 'lucide-react'

const MOCK_BLOOD_DATA = [
  { group: 'O+',  pct: 38, color: '#D32F2F' },
  { group: 'A+',  pct: 24, color: '#1976D2' },
  { group: 'B+',  pct: 20, color: '#2E7D32' },
  { group: 'AB+', pct: 10, color: '#6A1B9A' },
  { group: 'O-',  pct: 5,  color: '#F57C00' },
  { group: 'Other', pct: 3, color: '#00838F' },
]

const MOCK_HOSPITALS = [
  { name: 'Apollo Hospital',        city: 'Chennai',    stock: { 'A+': 12, 'B+': 8, 'O+': 15, 'AB+': 5 } },
  { name: 'AIIMS Blood Bank',       city: 'Delhi',      stock: { 'A+': 6,  'B+': 3, 'O+': 20, 'AB-': 2 } },
  { name: 'Fortis Blood Centre',    city: 'Bangalore',  stock: { 'A-': 4,  'O-': 7, 'B+': 12 } },
  { name: 'MGM Blood Bank',         city: 'Mumbai',     stock: { 'O+': 9,  'A+': 4, 'AB+': 3 } },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalDonors: 0, activeRequests: 0, hospitals: 0 })

  useEffect(() => {
    dbService.getAdminStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-indigo-900 px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white text-lg font-black">Admin Dashboard</h1>
            <p className="text-white/50 text-xs mt-0.5">Smart Blood Connect · Tamil Nadu</p>
          </div>
          <span className="bg-white/20 px-3 py-1.5 rounded-xl text-white text-xs font-bold">⚙️ Admin</span>
        </div>

        {/* Stat cards */}
        <div className="flex gap-2">
          {[
            { icon: Users,    value: stats.totalDonors,    label: 'Total Donors' },
            { icon: Activity, value: stats.activeRequests, label: 'Active Requests' },
            { icon: Hospital, value: stats.hospitals,      label: 'Hospitals' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex-1 bg-white/10 rounded-2xl py-3 px-2 flex flex-col items-center">
              <Icon size={16} className="text-white/60 mb-1" />
              <p className="text-white text-xl font-black">{value}</p>
              <p className="text-white/50 text-[10px] text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5 pb-24">
        {/* Blood group distribution donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Blood Group Distribution
          </h2>
          <div className="flex items-center gap-6">
            {/* SVG donut */}
            <div className="relative flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
                {(() => {
                  let offset = 0
                  const circumference = 2 * Math.PI * 40
                  return MOCK_BLOOD_DATA.map(d => {
                    const dash = (d.pct / 100) * circumference
                    const gap = circumference - dash
                    const el = (
                      <circle key={d.group} cx="60" cy="60" r="40"
                        fill="none"
                        stroke={d.color}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset * circumference / 100}
                        className="transition-all duration-500"
                      />
                    )
                    offset += d.pct
                    return el
                  })
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-black text-gray-900">Total</p>
                <p className="text-xs text-gray-500">Donors</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1">
              {MOCK_BLOOD_DATA.map(d => (
                <div key={d.group} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600 flex-1">{d.group}</span>
                  <span className="text-xs font-bold text-gray-900">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Blood Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <Hospital size={16} className="text-blue-600" /> Hospital Blood Stock
          </h2>
          <div className="flex flex-col gap-4">
            {MOCK_HOSPITALS.map(h => (
              <div key={h.name} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900 text-sm">{h.name}</p>
                  <span className="text-xs text-gray-400">{h.city}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(h.stock).map(([g, u]) => (
                    <span key={g} className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${u > 10 ? 'bg-green-50 text-green-700 border-green-100' : u > 5 ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {g}: {u}u
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood group availability bars */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 mb-4">Availability by Group</h2>
          <div className="flex flex-col gap-3">
            {MOCK_BLOOD_DATA.map(d => (
              <div key={d.group} className="flex items-center gap-3">
                <span className="w-8 text-xs font-black" style={{ color: d.color }}>{d.group}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
                <span className="text-xs font-bold text-gray-500 w-8 text-right">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
