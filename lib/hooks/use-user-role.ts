'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loadNavProfile } from '@/lib/profile'

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setRole(null)
        setIsLoggedIn(false)
        setLoading(false)
        return
      }
      setIsLoggedIn(true)
      const profile = await loadNavProfile(supabase, user)
      setRole(profile.role)
      setLoading(false)
    }

    load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load())
    return () => subscription.unsubscribe()
  }, [])

  return { role, isLoggedIn, loading }
}
