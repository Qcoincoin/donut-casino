import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { username, pin } = await req.json()

  if (!username || !pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid username or PIN' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data: existing } = await supabaseAdmin
    .from('players')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }

  const pinHash = await bcrypt.hash(pin, 10)

  const { data, error } = await supabaseAdmin
    .from('players')
    .insert({ username: username.toLowerCase(), pin_hash: pinHash, balance: 0 })
    .select('id, username, balance')
    .single()

  if (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ player: data })
}
