import { URGENCY_LEVELS } from '../../utils/constants'

export default function UrgencyBadge({ urgency }) {
  const level = URGENCY_LEVELS[urgency] || URGENCY_LEVELS[2]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${level.bgClass}`}>
      <span>{level.emoji}</span>
      <span>{level.label}</span>
    </span>
  )
}
