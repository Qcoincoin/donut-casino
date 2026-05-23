import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get('playerId')
  if (!playerId) return NextResponse.json({ error: 'Missing playerId' }, { status: 400 })

  const db = getSupabaseAdmin()
  const [{ data: deposits }, { data: withdrawals }] = await Promise.all([
    db.from('deposits').select('id,amount,status,created_at').eq('player_id', playerId).order('created_at', { ascending: false }).limit(10),
    db.from('withdrawals').select('id,amount,status,created_at').eq('player_id', playerId).order('created_at', { ascending: false }).limit(10),
  ])

  return NextResponse.json({ deposits: deposits ?? [], withdrawals: withdrawals ?? [] })
}
