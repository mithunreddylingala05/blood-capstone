import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { BLOOD_GROUPS } from '../../utils/constants'
import { User, Mail, Phone, MapPin, Droplets, Award, Star, LogOut, Edit3, X, Check, Heart, Building2, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react'
import { initials } from '../../utils/time'
import toast from 'react-hot-toast'

function InfoRow({ icon: Icon, label, value, isPrimary = false }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPrimary ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`font-bold text-sm ${isPrimary ? 'text-primary' : 'text-slate-900'}`}>{value || '—'}</p>
      </div>
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
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-16 pb-12 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[32px] bg-primary rotate-12 absolute inset-0 blur-xl opacity-20" />
                <div className="w-24 h-24 rounded-[32px] bg-white border-4 border-slate-50 flex items-center justify-center text-3xl font-heading text-primary relative shadow-hero">
                    {isHospital ? '🏥' : initials(user.name)}
                </div>
            </div>
            <h1 className="text-3xl font-heading text-slate-900 mb-1">{user.name}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{isHospital ? 'Medical Partner' : 'Life Saver Member'}</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
        {/* Availability Card */}
        <div className={`p-6 rounded-[32px] border flex items-center gap-4 transition-all ${user.is_available ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-100 border-slate-200'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.is_available ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-400 opacity-50'}`}>
            {user.is_available ? <Check size={24} className="text-white" /> : <X size={24} className="text-white" />}
          </div>
          <div className="flex-1">
            <p className={`font-heading text-lg leading-tight ${user.is_available ? 'text-emerald-900' : 'text-slate-500'}`}>
              {user.is_available ? 'Available Now' : 'Duty Off'}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {user.is_available ? 'You are visible to patients' : 'You are currently hidden'}
            </p>
          </div>
          <button onClick={() => toggleAvailability()} className="active:scale-90 transition-transform">
            {user.is_available
              ? <ToggleRight size={48} className="text-emerald-500" strokeWidth={1} />
              : <ToggleLeft size={48} className="text-slate-300" strokeWidth={1} />}
          </button>
        </div>

        {/* Info Grid */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-heading">Personal Details</h2>
            <button onClick={() => setEditOpen(true)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Edit3 size={18} />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
            {!isHospital && <InfoRow icon={Droplets} label="Blood Group" value={user.blood_group} isPrimary />}
            <InfoRow icon={MapPin} label="Location" value={`${user.location}, ${user.state}`} />
          </div>
        </div>

        {/* Stats Section */}
        {!isHospital && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-card">
              <Heart className="text-primary mb-3" size={24} />
              <p className="text-2xl font-black text-slate-900">{user.total_donations || 0}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Donations</p>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-card">
              <Award className="text-amber-500 mb-3" size={24} />
              <p className="text-2xl font-black text-slate-900">{user.rating > 0 ? user.rating : 'New'}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community Rank</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="w-full py-5 rounded-[24px] border border-rose-100 bg-rose-50/50 text-primary font-bold text-sm hover:bg-rose-50 transition-all flex items-center justify-center gap-2 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:pb-8">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditOpen(false)} />
            <div className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-hero animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-heading text-slate-900">Update Profile</h3>
                    <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4 mb-8">
                    {[
                        { label: 'Name', key: 'name', type: 'text' },
                        { label: 'Phone', key: 'phone', type: 'tel' },
                        { label: 'Address', key: 'location', type: 'text' },
                        { label: 'State', key: 'state', type: 'text' }
                    ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                            <input
                                type={field.type}
                                value={editForm[field.key]}
                                onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                                className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium border-0 focus:ring-4 ring-primary/10 transition-all"
                            />
                        </div>
                    ))}
                </div>

                <button onClick={handleSaveProfile} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-subtle">
                    Save Changes
                </button>
            </div>
        </div>
      )}

      {/* Blood Stock Update Modal */}
      {stockOpen && isHospital && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:pb-8">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setStockOpen(false)} />
            <div className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-hero animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-heading text-slate-900">Blood Inventory</h3>
                    <button onClick={() => setStockOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {BLOOD_GROUPS.map(g => (
                        <div key={g} className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center">
                            <span className="text-xs font-black text-primary mb-1 uppercase tracking-tighter">{g}</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={stock[g] || 0}
                                    onChange={e => setStock(s => ({ ...s, [g]: parseInt(e.target.value) || 0 }))}
                                    className="bg-transparent text-slate-900 font-bold text-center w-10 focus:outline-none" 
                                />
                                <span className="text-[10px] font-bold text-slate-400">UNITS</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleSaveStock} className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-subtle">
                    Update Inventory
                </button>
            </div>
        </div>
      )}

      {/* Hospital Stock Trigger */}
      {isHospital && (
        <div className="fixed bottom-32 left-0 right-0 flex justify-center px-6 pointer-events-none">
            <button 
                onClick={() => setStockOpen(true)}
                className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-hero pointer-events-auto flex items-center gap-2 animate-bounce-slow"
            >
                <Droplets size={20} /> Manage Blood Stock
            </button>
        </div>
      )}
    </div>
  )
}
