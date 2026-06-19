import { Link } from 'react-router-dom'
import { UserPlus, Hospital, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react'

function TypeCard({ icon: Icon, iconColor, title, subtitle, description, points, to }) {
  return (
    <Link to={to} className="group block bg-white rounded-[40px] p-8 border border-slate-100 shadow-card hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start gap-5 mb-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6 ${iconColor}`}>
          <Icon size={32} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{subtitle}</p>
          <h2 className="font-heading text-xl text-slate-900 leading-none">{title}</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight size={20} />
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">{description}</p>

      <div className="space-y-3 pt-6 border-t border-slate-50">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
            {p}
          </div>
        ))}
      </div>
    </Link>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-6 pt-16 pb-20">
      <div className="w-full max-w-sm mb-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Entry
        </Link>
        <h1 className="text-4xl font-heading text-slate-900 leading-none mb-4">Join Us</h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
          Select how you want to contribute to the global life-saving network.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <TypeCard
          icon={UserPlus}
          iconColor="bg-primary/10 text-primary"
          title="Citizen Donor"
          subtitle="Life Saver"
          description="Donate blood, track your contributions, and respond to local emergencies."
          points={['Find donors within 50km', 'Instant emergency alerts', 'Personal donation diary']}
          to="/register/user"
        />

        <TypeCard
          icon={Hospital}
          iconColor="bg-slate-900 text-white"
          title="Clinical Partner"
          subtitle="Healthcare"
          description="Manage inventory, post urgent requests, and verify community donors."
          points={['Live blood stock engine', 'Direct donor recruitment', 'Facility-wide reporting']}
          to="/register/hospital"
        />
      </div>
      
      <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest">
        SECURE COMMUNITY PLATFORM
      </p>
    </div>
  )
}
