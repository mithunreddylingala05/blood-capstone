import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Droplets, Mail, Lock, Eye, EyeOff } from 'lucide-react'
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
      navigate('/', { replace: true })
    } else {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="pt-16 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
          <Droplets size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 mt-2 text-center text-sm">Sign in to save lives today</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition text-sm"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base mt-2 hover:bg-primary-dark transition-colors disabled:opacity-60 shadow-lg shadow-red-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : 'Sign In →'}
        </button>
      </form>

      <div className="text-center mt-8 text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-bold">Create one</Link>
      </div>

      <p className="mt-auto pb-8 text-center text-xs text-gray-400">
        🔒 Secure & Encrypted Login
      </p>
    </div>
  )
}
