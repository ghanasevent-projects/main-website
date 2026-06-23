 'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

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

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
      options: { captchaToken },
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setServerError('Incorrect email or password. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setServerError('Please verify your email before logging in. Check your inbox.')
      } else {
        setServerError(error.message)
      }
      return
    }

    // Get role and redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = (profile as { role?: string } | null)?.role
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'organiser') router.push('/organiser/dashboard')
      else router.push(redirectTo)

      router.refresh()
    }
  }

  return (
    <AuthPageShell title="Welcome back" subtitle="Sign in to your account">
      <div className="space-y-6">
          {/* OAuth Buttons */}
          <OAuthButtons redirectTo={redirectTo} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {serverError}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
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
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-500 font-medium hover:underline">
              Create one
            </Link>
          </p>
      </div>
    </AuthPageShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}