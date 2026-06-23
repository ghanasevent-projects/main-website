'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine(d => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit({ password }: FormData) {
    setServerError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setServerError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (done) {
    return (
      <AuthPageShell title="Password updated" subtitle="You can now sign in with your new password">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
          <Link
            href="/login"
            className="inline-block text-sm text-brand-500 font-medium hover:underline"
          >
            Sign in now
          </Link>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell
      title="Set a new password"
      subtitle="Choose a strong password for your account"
    >
      <div className="space-y-6">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* New password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              New password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-foreground">
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register('confirm')}
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-colors placeholder:text-muted-foreground
                  ${errors.confirm ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
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
            {errors.confirm && (
              <p className="text-xs text-red-500">{errors.confirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-brand-500 hover:bg-brand-600 text-white font-medium
              rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </AuthPageShell>
  )
}
