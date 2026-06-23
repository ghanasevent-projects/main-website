import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: { width: 103, height: 9, className: 'h-6' },
  md: { width: 56, height: 5, className: 'h-3.5 sm:h-4' },
  lg: { width: 160, height: 14, className: 'h-9 sm:h-10' },
} as const

type SiteLogoProps = {
  href?: string
  size?: keyof typeof SIZES
  className?: string
  priority?: boolean
}

export function SiteLogo({
  href = '/',
  size = 'md',
  className,
  priority = false,
}: SiteLogoProps) {
  const { width, height, className: sizeClass } = SIZES[size]

  const image = (
    <Image
      src="/logo-2.png"
      alt="GhanasEvent"
      width={width}
      height={height}
      className={cn('w-auto object-contain', sizeClass, className)}
      priority={priority}
    />
  )

  if (!href) return <span className="inline-flex shrink-0 items-center">{image}</span>

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  )
}
