import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Map } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { BLOOD_GROUPS, INDIAN_STATES } from '../../utils/constants'
import toast from 'react-hot-toast'

function SectionLabel({ icon: Icon, label, color }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={15} />
      </div>
      <span className={`text-xs font-bold uppercase tracking-wide ${color.replace('bg-', 'text-').replace('-100', '-700')}`}>{label}</span>
    </div>
  )
}

export default function UserRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    bloodGroup: 'O+', role: 'donor',
    address: '', city: '', state: '', pincode: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading(true)
    const ok = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      bloodGroup: form.bloodGroup,
      location: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
      city: form.city.trim(),
      state: form.state,
      role: form.role,
    })
    setLoading(false)
    if (ok) { navigate('/', { replace: true }) }
    else { toast.error(useAuthStore.getState().error || 'Registration failed. Try again.') }
  }

  const field = (label, key, type = 'text', icon, extra = {}) => (
    <div>
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          required
          value={form[key]}
          onChange={e => set(key, e.target.value)}
          placeholder={label}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition`}
          {...extra}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white w-full max-w-7xl mx-auto">
      <div className="bg-primary px-5 pt-12 pb-5">
        <Link to="/register" className="text-white/70 flex items-center gap-1 text-sm mb-4">
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-white text-xl font-black">User Registration</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 pb-20">
        {/* Personal Info */}
        <div>
          <SectionLabel icon={User} label="Personal Information" color="bg-red-100" />
          <div className="flex flex-col gap-3">
            {field('Full Name', 'name', 'text', <User size={15} />)}
            {field('Email Address', 'email', 'email', <Mail size={15} />)}
            {field('Phone Number', 'phone', 'tel', <Phone size={15} />)}
          </div>
        </div>

        {/* Medical Info */}
        <div>
          <SectionLabel icon={User} label="Medical Information" color="bg-red-100" />
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Blood Group</label>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(g => (
                <button type="button" key={g} onClick={() => set('bloodGroup', g)}
                  className={`w-14 h-10 rounded-xl text-sm font-black border transition-all ${form.bloodGroup === g ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-800 border-gray-100'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold text-gray-600 mb-2 block">I am registering as</label>
            <div className="flex gap-2">
              {[['donor', 'Donor'], ['patient', 'Patient']].map(([val, lbl]) => (
                <button type="button" key={val} onClick={() => set('role', val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.role === val ? 'bg-red-50 text-primary border-primary' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <SectionLabel icon={MapPin} label="Address Details" color="bg-green-100" />
          <div className="flex flex-col gap-3">
            {field('Address Line', 'address', 'text', <MapPin size={15} />)}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select value={form.state} onChange={e => set('state', e.target.value)} required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-primary transition appearance-none">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {field('City', 'city', 'text')}
            </div>
            {field('Pincode', 'pincode', 'text', null, { maxLength: 6, pattern: '[0-9]{6}' })}
          </div>
        </div>

        {/* Password */}
        <div>
          <SectionLabel icon={Lock} label="Set Password" color="bg-orange-100" />
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Password (min. 6 chars)"
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-200 disabled:opacity-60 hover:bg-primary-dark transition-colors">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : 'Create Account →'}
        </button>
      </form>
    </div>
  )
}
