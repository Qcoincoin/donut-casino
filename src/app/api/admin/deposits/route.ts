import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('deposits')
    .select('*, players(username)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deposits: data })
}

export async function POST(req: NextRequest) {
  const { depositId, action } = await req.json()
  if (!depositId || !['confirm', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: deposit } = await db
    .from('deposits')
    .select('player_id, amount')
    .eq('id', depositId)
    .single()

  if (!deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })

  await db.from('deposits').update({ status: action === 'confirm' ? 'confirmed' : 'rejected' }).eq('id', depositId)

  if (action === 'confirm') {
    await db.rpc('increment_balance', { player_id: deposit.player_id, amount: deposit.amount })
  }

  return NextResponse.json({ ok: true })
}
