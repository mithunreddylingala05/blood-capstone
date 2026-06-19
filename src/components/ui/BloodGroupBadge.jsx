export default function BloodGroupBadge({ group, size = 'md' }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }
  return (
    <span className={`inline-flex items-center font-black rounded-lg border border-red-200 bg-red-50 text-primary ${sizes[size]}`}>
      {group}
    </span>
  )
}
