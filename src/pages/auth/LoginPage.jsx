import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email.trim(), password)
    setLoading(false)
    if (ok) {
      navigate('/home', { replace: true })
    } else {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-6 pt-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-hero">
            <Droplets size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-heading text-slate-900 leading-none">Welcome</h1>
          <p className="text-slate-400 mt-2 text-center text-sm font-medium">Continue your life-saving journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-slate-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none ring-primary/20 focus:ring-4 transition-all text-sm font-medium border-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none ring-primary/20 focus:ring-4 transition-all text-sm font-medium border-0"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg mt-2 hover:bg-slate-800 transition-all disabled:opacity-60 shadow-subtle flex items-center justify-center gap-2 group"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center mt-10 text-sm text-slate-400 font-medium">
          New to the community?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </div>
      </div>
      
      <p className="mt-auto pb-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        Smart Blood Connect 1.0
      </p>
    </div>
  )
}
