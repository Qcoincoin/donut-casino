import { createClient, SupabaseClient } from '@supabase/supabase-js'

function makeClient(key: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) throw new Error('Supabase env vars not set')
  return createClient(url, key === 'service' ? serviceKey : anonKey)
}

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase() {
  if (!_supabase) _supabase = makeClient('anon')
  return _supabase
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) _supabaseAdmin = makeClient('service')
  return _supabaseAdmin
}
