import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get('playerId')
  if (!playerId) return NextResponse.json({ error: 'Missing playerId' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { data } = await db.from('players').select('balance').eq('id', playerId).single()
  return NextResponse.json({ balance: data?.balance ?? 0 })
}
