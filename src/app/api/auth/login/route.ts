import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { username, pin } = await req.json()

  if (!username || !pin) {
    return NextResponse.json({ error: 'Missing username or PIN' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data: player, error } = await supabaseAdmin
    .from('players')
    .select('id, username, balance, pin_hash')
    .eq('username', username.toLowerCase())
    .single()

  if (error || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  const valid = await bcrypt.compare(pin, player.pin_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
  }

  return NextResponse.json({
    player: { id: player.id, username: player.username, balance: player.balance }
  })
}
