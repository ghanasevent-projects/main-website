'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Ticket, CalendarDays } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['attendee', 'organiser']),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'attendee' },
  })

  const selectedRole = watch('role')

  async function onSubmit(values: FormData) {
    setServerError(null)

    if (!captchaToken) {
      setServerError('Please complete the verification check.')
      return
    }

     const rateLimitCheck = await fetch('/api/auth/check-rate-limit', { method: 'POST' })
     if (!rateLimitCheck.ok) {
       const { error } = await rateLimitCheck.json()
       setServerError(error ?? 'Too many attempts. Please try again shortly.')
       return
     }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
          role: values.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        captchaToken,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('An account with this email already exists. Try logging in.')
      } else {
        setServerError(error.message)
      }
      return
    }

    // Supabase returns an existing user with no identities when the email
    // is already registered (it doesn't error, to avoid leaking accounts)
    if (data.user && data.user.identities?.length === 0) {
      setServerError('An account with this email already exists. Try logging in.')
      return
    }

    // If email confirmation is disabled in Supabase, a session is returned
    // immediately — sign the user straight in instead of asking them to verify
    if (data.session) {
      router.push(values.role === 'organiser' ? '/organiser/dashboard' : '/events')
      router.refresh()
      return
    }

    setSuccess(true)
  }

  // ── Success state ─────────────────────────────────────────
  if (success) {
    return (
      <AuthPageShell title="Almost there!" subtitle="One last step to get started">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We&apos;ve sent a verification link to your email address. Click it to activate your account.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm text-brand-500 font-medium hover:underline"
          >
            Back to login
          </Link>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell title="Create your account" subtitle="Join thousands discovering events in Ghana">
      <div className="space-y-6">
          {/* OAuth */}
          <OAuthButtons />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Role selector — before the fields */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">I want to</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'attendee')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm
                    transition-colors cursor-pointer
                    ${selectedRole === 'attendee'
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-input hover:border-muted-foreground text-muted-foreground'
                    }`}
                >
                  <Ticket className="h-4 w-4" />
                  <span className="font-medium text-xs">Attend events</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'organiser')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm
                    transition-colors cursor-pointer
                    ${selectedRole === 'organiser'
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-input hover:border-muted-foreground text-muted-foreground'
                    }`}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-medium text-xs">Organise events</span>
                </button>
              </div>
              <input type="hidden" {...register('role')} />
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Kwame Mensah"
                className={`w-full h-10 px-3 rounded-md border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-colors placeholder:text-muted-foreground
                  ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full h-10 px-3 rounded-md border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-colors placeholder:text-muted-foreground
                  ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  className={`w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                    transition-colors placeholder:text-muted-foreground
                    ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                    transition-colors placeholder:text-muted-foreground
                    ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-brand-500 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
            </p>

            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              className="w-full h-10 bg-brand-500 hover:bg-brand-600 text-white font-medium
                rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
      </div>
    </AuthPageShell>
  )
}