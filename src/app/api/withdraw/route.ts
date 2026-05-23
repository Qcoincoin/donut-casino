import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { playerId, amount } = await req.json()
  if (!playerId || !amount || amount < 1) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: player } = await db
    .from('players')
    .select('balance')
    .eq('id', playerId)
    .single()

  if (!player || player.balance < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const { data, error } = await db
    .from('withdrawals')
    .insert({ player_id: playerId, amount, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ withdrawal: data })
}
