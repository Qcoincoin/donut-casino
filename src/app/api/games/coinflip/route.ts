import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { playerId, bet, choice } = await req.json()

  if (!playerId || !bet || bet < 1 || !['heads', 'tails'].includes(choice)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: player } = await db.from('players').select('balance').eq('id', playerId).single()

  if (!player || player.balance < bet) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const result = Math.random() < 0.5 ? 'heads' : 'tails'
  const won = result === choice
  const payout = won ? bet : -bet

  await db.rpc(won ? 'increment_balance' : 'decrement_balance', { player_id: playerId, amount: bet })

  return NextResponse.json({ result, won, payout, newBalance: player.balance + payout })
}
