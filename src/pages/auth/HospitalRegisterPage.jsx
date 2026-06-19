import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Hospital, Mail, Phone, Lock, Eye, EyeOff, MapPin, Hash } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { INDIAN_STATES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function HospitalRegisterPage() {
  const [form, setForm] = useState({
    name: '', regNo: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', city: '', state: '', pincode: '', type: 'hospital',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    const ok = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      bloodGroup: 'N/A',
      location: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
      city: form.city.trim(),
      state: form.state,
      role: form.type,
    })
    setLoading(false)
    if (ok) navigate('/', { replace: true })
    else toast.error('Registration failed. Try again.')
  }

  const inp = (label, key, type = 'text', icon) => (
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">{icon}</span>}
      <input type={type} required value={form[key]} onChange={e => set(key, e.target.value)} placeholder={label}
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`} />
    </div>
  )

  return (
    <div className="min-h-screen bg-white w-full max-w-7xl mx-auto">
      <div className="bg-blue-700 px-5 pt-12 pb-5">
        <Link to="/register" className="text-white/70 flex items-center gap-1 text-sm mb-4">
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-white text-xl font-black">Hospital Registration</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 pb-20">
        {/* Facility type */}
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Type of Facility</label>
          <div className="flex gap-2">
            {[['hospital', '🏥 Hospital'], ['blood_bank', '🩸 Blood Bank']].map(([val, lbl]) => (
              <button type="button" key={val} onClick={() => set('type', val)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.type === val ? 'bg-blue-50 text-blue-700 border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Facility info */}
        <div>
          <label className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 block">Facility Information</label>
          <div className="flex flex-col gap-3">
            {inp('Hospital / Blood Bank Name', 'name', 'text', <Hospital size={15} />)}
            {inp('Registration Number', 'regNo', 'text', <Hash size={15} />)}
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 block">Contact Information</label>
          <div className="flex flex-col gap-3">
            {inp('Official Email', 'email', 'email', <Mail size={15} />)}
            {inp('Phone Number', 'phone', 'tel', <Phone size={15} />)}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3 block">Address Details</label>
          <div className="flex flex-col gap-3">
            {inp('Address Line', 'address', 'text', <MapPin size={15} />)}
            <div className="grid grid-cols-2 gap-3">
              <select value={form.state} onChange={e => set('state', e.target.value)} required
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition appearance-none">
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {inp('City', 'city')}
            </div>
            {inp('Pincode', 'pincode', 'text')}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-3 block">Set Password</label>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Password" className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                placeholder="Confirm Password" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-blue-200 disabled:opacity-60 hover:bg-blue-800 transition-colors">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Registering...
            </span>
          ) : 'Register Facility →'}
        </button>
      </form>
    </div>
  )
}
