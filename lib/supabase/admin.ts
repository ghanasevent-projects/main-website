import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null

/** Service-role client — bypasses RLS. Use only in trusted server code. */
export function getAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables')
  }
  if (!client) {
    client = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return client
}

/** @deprecated Use getAdminClient() */
export const adminClient = {
  from: (table: string) => getAdminClient().from(table),
}
