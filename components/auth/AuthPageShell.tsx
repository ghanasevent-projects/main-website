import Image from 'next/image'
import { SiteLogo } from '@/components/brand/SiteLogo'

const MOSAIC_IMAGES = [
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80',
  'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=600&q=80',
]

const MOBILE_HERO =
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&q=80'

type AuthPageShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Desktop — Eventbrite-style photo mosaic */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 p-1.5">
          {MOSAIC_IMAGES.map((src, i) => (
            <div key={src} className="relative overflow-hidden rounded-sm">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw"
                className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                priority={i < 3}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 via-brand-800/75 to-brand-900/90" />
        <div className="relative z-10 flex flex-col justify-end p-10 xl:p-14 text-white">
          <div className="space-y-4 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
              Discover Ghana
            </p>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              Your next unforgettable event starts here.
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              From concerts and festivals to church gatherings and campus weeks — find and book
              the best events across Ghana.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 relative flex flex-col min-h-screen lg:bg-gray-50">
        {/* Mobile / tablet background */}
        <div className="lg:hidden absolute inset-0">
          <Image
            src={MOBILE_HERO}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-12">
          <div className="w-full max-w-[420px]">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <SiteLogo size="md" priority />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white lg:text-foreground">{title}</h1>
              <p className="text-sm mt-1.5 text-white/75 lg:text-muted-foreground">{subtitle}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-white/20 lg:border-border p-7 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
