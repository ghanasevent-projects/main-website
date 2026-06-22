export default function EventSchedule({
  lines,
  className = '',
}: {
  lines: string[]
  className?: string
}) {
  if (!lines.length) return null

  if (lines.length === 1) {
    return <p className={className}>{lines[0]}</p>
  }

  return (
    <ul className={`space-y-1.5 ${className}`}>
      {lines.map(line => (
        <li key={line} className="flex gap-2 text-base font-medium text-gray-800">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9973A]" aria-hidden />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}
