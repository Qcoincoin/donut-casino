import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, pin } = await req.json()
  const validUser = process.env.ADMIN_USERNAME
  const validPin = process.env.ADMIN_PIN

  if (username === validUser && pin === validPin) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
