import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { username } = await req.json()
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 })

  const supabaseAdmin = getSupabaseAdmin()
  const { data } = await supabaseAdmin
    .from('players')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  return NextResponse.json({ exists: !!data })
}
