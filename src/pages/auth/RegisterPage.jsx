import { Link } from 'react-router-dom'
import { UserPlus, Hospital, ArrowLeft, CheckCircle } from 'lucide-react'

function TypeCard({ icon: Icon, iconColor, title, subtitle, description, points, to }) {
  return (
    <Link to={to} className="block bg-white rounded-3xl border border-gray-100 p-5 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <h2 className="font-black text-gray-900 text-lg">{title}</h2>
          <p className="text-sm font-semibold" style={{ color: iconColor.includes('red') ? '#D32F2F' : '#1976D2' }}>{subtitle}</p>
        </div>
        <ArrowLeft size={16} className="text-gray-300 rotate-180 mt-1" />
      </div>

      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{description}</p>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
            {p}
          </div>
        ))}
      </div>
    </Link>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white w-full max-w-7xl mx-auto px-6">
      <div className="pt-14 pb-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 text-sm mb-8">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Join our community to start saving lives today. Choose your account type.
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-10">
        <TypeCard
          icon={UserPlus}
          iconColor="bg-red-50 text-primary"
          title="Donor / Patient"
          subtitle="Become part of the life-saving network"
          description="Ideal for individuals who want to donate blood or request help during emergencies."
          points={['Find donors within 50km radius', 'Request blood in one tap', 'Digital donation tracking']}
          to="/register/user"
        />

        <TypeCard
          icon={Hospital}
          iconColor="bg-blue-50 text-blue-700"
          title="Hospital / Blood Bank"
          subtitle="Manage stock and emergency requests"
          description="Designed for medical facilities to manage blood inventories and donor connections."
          points={['Manage real-time blood stock', 'Post facility-wide requests', 'Direct donor communication']}
          to="/register/hospital"
        />

        <p className="text-center text-xs text-gray-400 mt-2">🔒 Secure & Encrypted Registration</p>
      </div>
    </div>
  )
}
