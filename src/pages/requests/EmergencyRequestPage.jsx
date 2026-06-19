import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRequestStore } from '../../store/requestStore'
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../utils/constants'
import { Siren, Info, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmergencyRequestPage() {
  const { user } = useAuthStore()
  const { createRequest, loading } = useRequestStore()

  const isHospital = user?.role === 'hospital' || user?.role === 'blood_bank'

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 w-full">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Alert Broadcasted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your emergency request has been sent to all donors in your area. Please stay by your phone.
          </p>
          <button onClick={() => { setSuccess(false); setForm({ patientName: '', bloodGroup: 'A+', hospitalName: '', emergencyContact: user?.phone || '', units: 1, urgency: 0 }) }}
            className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-colors">
            Post Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-primary px-5 pt-14 pb-6 relative overflow-hidden">
        <Siren size={120} className="absolute -right-6 -top-4 text-white/10" />
        <h1 className="text-white text-2xl font-black">Emergency SOS</h1>
        <p className="text-white/70 text-sm mt-1">Broadcast to all donors within 50km</p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5 pb-24">
        {/* Alert banner */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
          <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-primary text-xs font-semibold leading-relaxed">
            Broadcasting this request will alert all eligible donors within 50km immediately.
          </p>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Patient Information</span>
          </div>
          <div className="divide-y divide-gray-50">
            <input value={form.patientName} onChange={e => set('patientName', e.target.value)}
              placeholder="Patient Full Name"
              className="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-red-50/30 transition" />
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">Blood Group Required</p>
              <div className="flex flex-wrap gap-2">
                {BLOOD_GROUPS.map(g => (
                  <button key={g} type="button" onClick={() => set('bloodGroup', g)}
                    className={`w-14 h-10 rounded-xl text-sm font-black border transition-all ${form.bloodGroup === g ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-800 border-gray-100'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Location & Contact</span>
          </div>
          <div className="divide-y divide-gray-50">
            <input value={form.hospitalName} onChange={e => set('hospitalName', e.target.value)}
              placeholder="Hospital Name"
              className="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-red-50/30 transition" />
            <input value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)}
              placeholder="Emergency Contact Number" type="tel"
              className="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-red-50/30 transition" />
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Request Details</span>
          </div>
          <div className="p-4 divide-y divide-gray-50 flex flex-col gap-4">
            {/* Units */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500">Units Required</p>
                <span className="text-xs font-black text-primary">{form.units} Unit{form.units > 1 ? 's' : ''}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => set('units', n)}
                    className={`flex-1 h-11 rounded-xl text-sm font-black transition-all ${form.units === n ? 'bg-primary text-white' : 'bg-gray-50 text-gray-800'}`}>
                    {n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">Urgency Level</p>
              <div className="flex gap-2">
                {URGENCY_LEVELS.map(lvl => (
                  <button key={lvl.value} onClick={() => set('urgency', lvl.value)}
                    style={form.urgency === lvl.value ? { backgroundColor: lvl.color, borderColor: lvl.color } : { borderColor: lvl.color + '40', backgroundColor: lvl.bg }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${form.urgency === lvl.value ? 'text-white' : ''}`}
                    style2={{ color: form.urgency === lvl.value ? '#fff' : lvl.color }}>
                    <span style={{ color: form.urgency === lvl.value ? '#fff' : lvl.color }}>
                      {lvl.emoji} {lvl.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-primary text-white py-5 rounded-2xl font-black text-base tracking-wide shadow-lg shadow-red-200 disabled:opacity-60 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Broadcasting...</>
          ) : (
            <><Siren size={18} /> BROADCAST EMERGENCY</>
          )}
        </button>
      </div>
    </div>
  )
}
