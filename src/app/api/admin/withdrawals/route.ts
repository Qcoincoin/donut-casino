import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('withdrawals')
    .select('*, players(username)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ withdrawals: data })
}

export async function POST(req: NextRequest) {
  const { withdrawalId, action } = await req.json()
  if (!withdrawalId || !['confirm', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: withdrawal } = await db
    .from('withdrawals')
    .select('player_id, amount')
    .eq('id', withdrawalId)
    .single()

  if (!withdrawal) return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })

  await db.from('withdrawals').update({ status: action === 'confirm' ? 'confirmed' : 'rejected' }).eq('id', withdrawalId)

  if (action === 'reject') {
    // Balance was deducted on submit — refund it if rejected
    await db.rpc('increment_balance', { player_id: withdrawal.player_id, amount: withdrawal.amount })
  }

  return NextResponse.json({ ok: true })
}
