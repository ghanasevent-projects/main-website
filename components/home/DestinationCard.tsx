import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface DestinationCardProps {
  href: string
  label: string
  imageUrl?: string | null
  subtitle?: string
  aspect?: 'portrait' | 'landscape'
}

export default function DestinationCard({
  href,
  label,
  imageUrl,
  subtitle,
  aspect = 'portrait',
}: DestinationCardProps) {
  const aspectClass = aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'

  return (
    <Link
      href={href}
      className="group relative block shrink-0 overflow-hidden rounded-2xl bg-gray-200
                 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className={`relative w-full ${aspectClass}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1a472a] via-[#2d5a3d] to-gold/80" />
        )}

        {/* Layered overlay — stronger at bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        {/* Subtle vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.25)_100%)]" />

        {/* Region badge — top left */}
        {subtitle && (
          <span className="absolute left-3 top-3 rounded-full border border-white/25
                           bg-black/40 px-2.5 py-1 text-[10px] font-semibold
                           uppercase tracking-wide text-white/90 backdrop-blur-sm">
            {subtitle}
          </span>
        )}

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p
            className="text-xl font-extrabold leading-tight text-white drop-shadow-md
                       transition-transform duration-300 group-hover:-translate-y-5"
            style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            {label}
          </p>

          {/* Browse events CTA — slides up on hover */}
          <div className="flex translate-y-4 items-center gap-1.5 opacity-0 transition-all
                          duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-xs font-semibold text-white/90">Browse events</span>
            <ArrowRight className="h-3.5 w-3.5 text-white/90" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </Link>
  )
}
