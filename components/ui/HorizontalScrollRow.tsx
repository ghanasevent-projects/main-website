'use client'

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/icons'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

const HIDE_ARROWS_FROM: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
}

type HorizontalScrollRowProps = {
  children: ReactNode
  className?: string
  wrapperClassName?: string
  /** Hide arrow controls from this breakpoint upward (when layout switches to grid). */
  hideArrowsFrom?: Breakpoint
  /** Tailwind gradient start class for edge fades (e.g. `from-[#fdfbf7]`). */
  edgeFadeClass?: string
}

export default function HorizontalScrollRow({
  children,
  className = '',
  wrapperClassName = '',
  hideArrowsFrom = 'lg',
  edgeFadeClass = 'from-white',
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const hasOverflow = scrollWidth > clientWidth + 2

    setOverflowing(hasOverflow)
    setCanScrollLeft(hasOverflow && scrollLeft > 2)
    setCanScrollRight(hasOverflow && scrollLeft + clientWidth < scrollWidth - 2)
  }, [])

  useEffect(() => {
    updateScrollState()

    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollState, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState, children])

  const scrollByPage = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  const arrowHideClass = HIDE_ARROWS_FROM[hideArrowsFrom]
  const showArrows = overflowing

  return (
    <div className={`relative ${wrapperClassName}`}>
      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByPage('left')}
            className={`absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center
                        justify-center rounded-full border border-gray-200 bg-white/95 text-gray-900
                        shadow-md backdrop-blur-sm transition hover:bg-white
                        disabled:pointer-events-none disabled:opacity-0
                        ${arrowHideClass}
                        ${canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={ICON_STROKE_WIDTH} />
          </button>

          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByPage('right')}
            className={`absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center
                        justify-center rounded-full border border-gray-200 bg-white/95 text-gray-900
                        shadow-md backdrop-blur-sm transition hover:bg-white
                        disabled:pointer-events-none disabled:opacity-0
                        ${arrowHideClass}
                        ${canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={ICON_STROKE_WIDTH} />
          </button>

          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 z-[1] w-10
                        bg-linear-to-r ${edgeFadeClass} to-transparent transition-opacity
                        ${arrowHideClass}
                        ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 z-[1] w-10
                        bg-linear-to-l ${edgeFadeClass} to-transparent transition-opacity
                        ${arrowHideClass}
                        ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      )}

      <div
        ref={scrollRef}
        className={className}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}
