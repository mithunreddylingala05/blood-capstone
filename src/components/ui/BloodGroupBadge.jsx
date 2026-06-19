export default function BloodGroupBadge({ group, size = 'md' }) {
  const sizes = { sm: 'text-[10px] px-2 py-0.5', md: 'text-[12px] px-2.5 py-1', lg: 'text-sm px-4 py-1.5' }
  return (
    <span className={`inline-flex items-center font-black rounded-lg bg-primary/10 text-primary border border-primary/5 uppercase tracking-tighter ${sizes[size]}`}>
      {group}
    </span>
  )
}
