import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../utils/constants'
import { Siren, Info, CheckCircle2, ArrowRight, Activity, MapPin, User, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmergencyRequestPage() {
  const { user } = useAuthStore()
  const { createRequest, loading } = useRequestStore()

  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: user?.blood_group || 'A+',
    hospitalName: '',
    emergencyContact: user?.phone || '',
    units: 1,
    urgency: 0,
  })
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.patientName.trim() || !form.hospitalName.trim() || !form.emergencyContact.trim()) {
      toast.error('Please fill in all details')
      return
    }
    const ok = await createRequest({
      patient_name: form.patientName.trim(),
      blood_group: form.bloodGroup,
      hospital_name: form.hospitalName.trim(),
      hospital_location: user?.location || '',
      units_required: form.units,
      urgency: form.urgency,
      requested_by: user?.id,
      latitude: user?.latitude || null,
      longitude: user?.longitude || null,
      status: 0,
    })
    if (ok) setSuccess(true)
    else toast.error('Broadcast failed. Try again.')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center px-6 pt-16 pb-20 animate-fade-in">
        <div className="bg-white rounded-[40px] p-10 text-center shadow-card border border-emerald-100 w-full max-w-sm">
          <div className="w-20 h-20 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-hero shadow-emerald-200">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-heading text-slate-900 mb-4 leading-tight">SOS Sent!</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            Your emergency request has been broadcasted to all donors in your area.
          </p>
          <button onClick={() => { setSuccess(false); setForm({ patientName: '', bloodGroup: 'A+', hospitalName: '', emergencyContact: user?.phone || '', units: 1, urgency: 0 }) }}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-subtle flex items-center justify-center gap-2 group">
            New Request <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-12 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="max-w-4xl mx-auto relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-hero animate-bounce-slow">
                <Siren size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-heading text-slate-900 leading-tight">Emergency SOS</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Network-wide Priority Alert</p>
            </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
        {/* Warning Banner */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-6 flex gap-4">
          <Info size={20} className="text-primary flex-shrink-0" />
          <p className="text-primary text-[10px] font-black uppercase tracking-widest leading-normal">
            Real-time broadcast will alert 100+ local donors immediately. Only for priority cases.
          </p>
        </div>

        {/* Patient Details */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-slate-100 space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={16} />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Patient Details</h3>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                        value={form.patientName} 
                        onChange={e => set('patientName', e.target.value)}
                        placeholder="Legal name of patient"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-sm font-medium border-0 focus:ring-4 ring-primary/10 transition-all placeholder:text-slate-300" 
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Required Blood Group</label>
                    <div className="grid grid-cols-4 gap-2">
                        {BLOOD_GROUPS.map(g => (
                            <button 
                                key={g} 
                                type="button" 
                                onClick={() => set('bloodGroup', g)}
                                className={`h-11 rounded-2xl text-xs font-black border transition-all ${form.bloodGroup === g ? 'bg-primary text-white border-primary shadow-hero' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Hospital & Pulse */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-slate-100 space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin size={16} />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Facility & Impact</h3>
            </div>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hospital / Clinic</label>
                        <input 
                            value={form.hospitalName} 
                            onChange={e => set('hospitalName', e.target.value)}
                            placeholder="Admitted hospital name"
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-sm font-medium border-0 focus:ring-4 ring-primary/10 transition-all placeholder:text-slate-300" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Emergency Contact</label>
                        <input 
                            value={form.emergencyContact} 
                            onChange={e => set('emergencyContact', e.target.value)}
                            placeholder="+XX 00000 00000"
                            type="tel"
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-sm font-medium border-0 focus:ring-4 ring-primary/10 transition-all placeholder:text-slate-300" 
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Units Needed</label>
                        <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{form.units} Units</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                            <button 
                                key={n} 
                                onClick={() => set('units', n)}
                                className={`flex-1 h-12 rounded-2xl text-xs font-black transition-all ${form.units === n ? 'bg-slate-900 text-white shadow-subtle' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                {n === 5 ? '5+' : n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Urgency Matrix */}
        <div className="px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1 flex items-center gap-2">
                <Activity size={14} className="text-primary" /> Priority Level
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {URGENCY_LEVELS.map(lvl => {
                    const isActive = form.urgency === lvl.value
                    return (
                        <button 
                            key={lvl.value} 
                            onClick={() => set('urgency', lvl.value)}
                            className={`p-4 rounded-3xl border flex flex-col items-center gap-2 transition-all ${isActive ? 'bg-white border-primary shadow-hero ring-4 ring-primary/5' : 'bg-white border-slate-100 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
                        >
                            <span className="text-2xl">{lvl.emoji}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                                {lvl.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Submit */}
        <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-primary text-white py-6 rounded-[32px] font-heading text-xl shadow-hero hover:bg-rose-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Broadcasting...</span>
            </div>
          ) : (
            <>
                <Heart size={24} className="group-hover:scale-125 transition-transform" fill="currentColor" /> 
                BROADCAST SOS
            </>
          )}
        </button>
      </div>
    </div>
  )
}
