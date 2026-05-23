import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { playerId, amount } = await req.json()
  if (!playerId || !amount || amount < 1) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('deposits')
    .insert({ player_id: playerId, amount, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deposit: data })
}
