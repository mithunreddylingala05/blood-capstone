import { Phone, MapPin, Star, Award, MessageCircle, MoreVertical } from 'lucide-react'
import BloodGroupBadge from './BloodGroupBadge'
import { initials } from '../../utils/time'
import { formatDistance } from '../../utils/distance'

export default function DonorCard({ donor, isClosest = false, onContact }) {
  const isHospital = donor.role === 'hospital' || donor.role === 'blood_bank'

  return (
    <div className={`bg-white rounded-[40px] p-6 border shadow-card transition-all duration-300 relative group overflow-hidden ${isClosest ? 'border-primary/20' : 'border-slate-100'}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-heading text-xl flex-shrink-0 shadow-subtle ${isHospital ? 'bg-slate-900 text-white' : 'bg-primary/10 text-primary'}`}>
                {isHospital ? '🏥' : initials(donor.name)}
            </div>
            {donor.is_available && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white" />
            )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-heading text-slate-900 truncate">{donor.name}</h3>
            {!isHospital && <BloodGroupBadge group={donor.blood_group} size="sm" />}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin size={12} className="text-slate-300" />
            <span className="truncate">{donor.location || donor.city}</span>
            {donor.distance_km > 0 && (
              <span className="text-primary tracking-normal font-black">· {formatDistance(donor.distance_km)}</span>
            )}
          </div>

          <div className="flex gap-4">
              {donor.total_donations > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                  <Award size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{donor.total_donations} Saved</span>
                </div>
              )}
              {donor.rating > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{donor.rating.toFixed(1)}</span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Hospital Stock Panel */}
      {isHospital && donor.blood_stock && (
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
          {Object.entries(donor.blood_stock).filter(([, v]) => v > 0).map(([g, u]) => (
            <div key={g} className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
              <span className="text-[10px] font-black text-primary uppercase">{g}</span>
              <span className="text-[10px] font-bold text-slate-400">{u}U</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-2">
        <a
          href={`tel:${donor.phone}`}
          onClick={() => onContact?.()}
          className="flex-1 bg-slate-900 text-white h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-subtle hover:bg-slate-800 transition-all active:scale-95"
        >
          <Phone size={16} /> Call
        </a>
        <a
          href={`https://wa.me/${donor.phone?.replace(/\D/g,'')}`}
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 bg-white text-slate-400 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all active:scale-95"
        >
          <MessageCircle size={20} />
        </a>
        <button className="w-12 h-12 bg-white text-slate-400 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  )
}
