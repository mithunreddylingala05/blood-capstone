import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { BLOOD_GROUPS } from '../../utils/constants'
import {
  User, Mail, Phone, MapPin, Droplets, Award, Star, LogOut,
  Edit3, X, Check, Heart, Building2, ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react'
import { initials } from '../../utils/time'
import toast from 'react-hot-toast'

function InfoRow({ icon: Icon, label, value, isPrimary = false }) {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4">
      <Icon size={18} className={isPrimary ? 'text-primary' : 'text-gray-400'} />
      <span className="text-gray-500 text-sm flex-1">{label}</span>
      <span className={`font-bold text-sm ${isPrimary ? 'text-primary' : 'text-gray-900'}`}>{value || '—'}</span>
    </div>
  )
}

function InfoCard({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <Icon size={15} className="text-gray-400" />
      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{title}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout, toggleAvailability, updateProfile, updateBloodStock } = useAuthStore()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)

  const [editForm, setEditForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', state: user?.state || '' })
  const [stock, setStock] = useState(user?.blood_stock || {})

  const isHospital = user?.role === 'hospital' || user?.role === 'blood_bank'

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleSaveProfile = async () => {
    await updateProfile(editForm)
    setEditOpen(false)
    toast.success('Profile updated!')
  }

  const handleSaveStock = async () => {
    await updateBloodStock(stock)
    setStockOpen(false)
    toast.success('Blood stock updated!')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      {/* Hero */}
      <div className={`px-5 pt-14 pb-8 relative overflow-hidden ${isHospital ? 'bg-blue-700' : 'bg-primary'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-3 ${isHospital ? 'bg-blue-100 text-blue-700' : 'bg-white text-primary'}`}>
            {isHospital ? '🏥' : initials(user.name)}
          </div>
          <h1 className="text-white text-xl font-black">{user.name}</h1>
          <p className="text-white/70 text-sm mt-0.5">{isHospital ? 'Healthcare Partner' : 'Blood Donor'}</p>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5 pb-24">
        {/* Donor stats */}
        {!isHospital && (
          <div className="flex gap-3">
            {[
              { icon: Heart, label: 'Donations', value: user.total_donations || 0, color: 'text-primary' },
              { icon: Star,  label: 'Rating',    value: user.rating || 0,           color: 'text-yellow-500' },
              { icon: Droplets, label: 'Blood Group', value: user.blood_group,     color: 'text-primary' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex-1 bg-white rounded-2xl border border-gray-100 py-4 px-2 flex flex-col items-center gap-1.5">
                <Icon size={18} className={color} />
                <span className="font-black text-gray-900 text-lg leading-none">{value}</span>
                <span className="text-gray-400 text-[10px]">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Availability toggle */}
        <div className={`rounded-2xl border p-4 flex items-center gap-4 ${user.is_available ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${user.is_available ? 'bg-green-500' : 'bg-gray-400'}`}>
            {user.is_available ? <Check size={20} className="text-white" /> : <X size={20} className="text-white" />}
          </div>
          <div className="flex-1">
            <p className={`font-bold text-sm ${user.is_available ? 'text-green-800' : 'text-gray-700'}`}>
              {user.is_available ? 'Available for Donation' : 'Currently Unavailable'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.is_available ? 'Visible to those in need' : 'Hidden from search results'}
            </p>
          </div>
          <button onClick={() => toggleAvailability()}>
            {user.is_available
              ? <ToggleRight size={32} className="text-green-500" />
              : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>

        {/* Personal / Hospital Info */}
        {!isHospital ? (
          <>
            <div>
              <SectionHeader icon={User} title="Personal Information" />
              <InfoCard>
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={Phone} label="Phone" value={user.phone} />
                <InfoRow icon={User} label="Role" value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} />
              </InfoCard>
            </div>
            <div>
              <SectionHeader icon={Droplets} title="Blood Details" />
              <InfoCard>
                <InfoRow icon={Droplets} label="Blood Group" value={user.blood_group} isPrimary />
                <InfoRow icon={Award} label="Total Donations" value={`${user.total_donations || 0} times`} />
                <InfoRow icon={Star} label="Rating" value={user.rating > 0 ? `${user.rating} / 5.0` : 'New Member'} />
              </InfoCard>
            </div>
          </>
        ) : (
          <div>
            <SectionHeader icon={Building2} title="Hospital Information" />
            <InfoCard>
              <InfoRow icon={Building2} label="Name" value={user.name} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Phone" value={user.phone} />
            </InfoCard>
          </div>
        )}

        {/* Location */}
        <div>
          <SectionHeader icon={MapPin} title="Location" />
          <InfoCard>
            <InfoRow icon={MapPin} label="Address" value={user.location} />
            <InfoRow icon={MapPin} label="State" value={user.state} />
          </InfoCard>
        </div>

        {/* Hospital blood stock */}
        {isHospital && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Droplets size={15} className="text-blue-500" />
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Blood Stock</span>
              </div>
              <button onClick={() => setStockOpen(true)} className="text-blue-600 text-xs font-bold flex items-center gap-1">
                <Edit3 size={12} /> Update
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(g => (
                <div key={g} className={`px-3 py-2 rounded-xl border text-center ${(user.blood_stock?.[g] || 0) > 0 ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="font-black text-sm text-blue-700">{g}</p>
                  <p className="text-xs text-gray-500">{user.blood_stock?.[g] || 0}u</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => setEditOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit3 size={15} /> Edit Profile
          </button>
          <button onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 border border-red-100 py-3 rounded-2xl text-sm font-bold text-primary hover:bg-red-100 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Edit Profile Sheet */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setEditOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-3xl px-6 pt-8 pb-10 w-full max-w-7xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-900 text-xl">Edit Profile</h3>
              <button onClick={() => setEditOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            {[['Full Name', 'name'], ['Phone Number', 'phone'], ['Address', 'location'], ['State', 'state']].map(([label, key]) => (
              <div key={key} className="mb-4">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{label}</label>
                <input value={editForm[key]} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary transition" />
              </div>
            ))}
            <button onClick={handleSaveProfile}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Blood Stock Update Sheet */}
      {stockOpen && isHospital && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setStockOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-3xl px-6 pt-8 pb-10 w-full max-w-7xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-900 text-xl">Update Blood Stock</h3>
              <button onClick={() => setStockOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {BLOOD_GROUPS.map(g => (
                <div key={g} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                  <span className="font-black text-primary w-8">{g}</span>
                  <input type="number" min="0" value={stock[g] || 0}
                    onChange={e => setStock(s => ({ ...s, [g]: parseInt(e.target.value) || 0 }))}
                    className="flex-1 bg-transparent text-gray-900 font-bold text-center focus:outline-none" />
                  <span className="text-gray-400 text-xs">units</span>
                </div>
              ))}
            </div>
            <button onClick={handleSaveStock}
              className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-colors">
              Update Stock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
