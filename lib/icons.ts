import type { LucideProps } from 'lucide-react'

/** Editorial monochrome icon defaults — thin stroke, soft black. */
export const ICON_STROKE_WIDTH = 1.5

export const iconDefaults = {
  strokeWidth: ICON_STROKE_WIDTH,
  className: 'text-gray-900',
} satisfies Pick<LucideProps, 'strokeWidth' | 'className'>

const SIZE_CLASS = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
} as const

export function iconClassName(
  size: keyof typeof SIZE_CLASS = 'md',
  extra?: string,
): string {
  return ['shrink-0 text-gray-900', SIZE_CLASS[size], extra].filter(Boolean).join(' ')
}
