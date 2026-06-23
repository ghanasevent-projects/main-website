'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit({ email }: FormData) {
    setServerError(null)
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) {
      setServerError(error.message)
      return
    }
    setSentEmail(email)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthPageShell title="Check your inbox" subtitle="A reset link is on its way">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              We sent a password reset link to
            </p>
            <p className="font-semibold text-gray-900">{sentEmail}</p>
            <p className="text-xs text-gray-400 pt-1">
              Check your spam folder if you don&apos;t see it within a few minutes.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-brand-500 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <div className="space-y-6">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full h-10 pl-9 pr-3 rounded-md border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-colors placeholder:text-muted-foreground
                  ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-input'}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
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
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="text-brand-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageShell>
  )
}
