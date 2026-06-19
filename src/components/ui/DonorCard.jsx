import { Phone, MapPin, Star, Droplets, Award } from 'lucide-react'
import BloodGroupBadge from './BloodGroupBadge'
import { initials } from '../../utils/time'
import { formatDistance } from '../../utils/distance'

export default function DonorCard({ donor, isClosest = false, onContact }) {
  const isHospital = donor.role === 'hospital' || donor.role === 'blood_bank'
  const accentColor = isHospital ? 'blue' : 'red'

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isClosest ? 'border-primary' : 'border-gray-100'}`}>
      {isClosest && (
        <div className="bg-primary text-white text-xs font-bold text-center py-1">
          📍 Closest Match
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${isHospital ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-primary'}`}>
            {isHospital ? '🏥' : initials(donor.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-gray-900 truncate">{donor.name}</h3>
              <BloodGroupBadge group={donor.blood_group} size="sm" />
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
              <MapPin size={11} />
              <span className="truncate">{donor.location || donor.city}</span>
              {donor.distance_km > 0 && (
                <span className="ml-1 text-primary font-semibold">· {formatDistance(donor.distance_km)}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {donor.total_donations > 0 && (
                <span className="flex items-center gap-1">
                  <Award size={11} className="text-primary" />
                  {donor.total_donations} donations
                </span>
              )}
              {donor.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-yellow-500" />
                  {donor.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Hospital blood stock */}
            {isHospital && donor.blood_stock && (
              <div className="mt-3 flex flex-wrap gap-1">
                {Object.entries(donor.blood_stock).filter(([, v]) => v > 0).map(([g, u]) => (
                  <span key={g} className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-100">
                    {g}: {u}u
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${donor.is_available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {donor.is_available ? '● Available' : '○ Busy'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${donor.phone}`}
            onClick={() => onContact?.()}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors"
          >
            <Phone size={14} />
            Call Now
          </a>
          <a
            href={`https://wa.me/${donor.phone?.replace(/\D/g,'')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-100 py-2.5 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
