'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const games = [
  { name: 'Coin Flip', icon: '🪙', href: '/games/coinflip' },
  { name: 'Dice Roll', icon: '🎲', href: '/games/dice', soon: true },
  { name: 'Slots', icon: '🎰', href: '/games/slots', soon: true },
  { name: 'Blackjack', icon: '🃏', href: '/games/blackjack', soon: true },
  { name: 'Roulette', icon: '🎡', href: '/games/roulette', soon: true },
  { name: 'Crash', icon: '📈', href: '/games/crash', soon: true },
  { name: 'Mines', icon: '💣', href: '/games/mines', soon: true },
  { name: 'Hi-Lo', icon: '🔼', href: '/games/hilo', soon: true },
]

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const path = usePathname()

  return (
    <aside
      className="shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden transition-all duration-300"
      style={{ width: open ? 200 : 56, background: '#0f1923', borderRight: '1px solid #1e2d3d' }}
    >
      {/* Toggle / logo */}
      <div className="h-14 flex items-center px-3 shrink-0" style={{ borderBottom: '1px solid #1e2d3d' }}>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-lg shrink-0 transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = '#16202e')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span className="block w-4 h-[2px] rounded-full" style={{ background: '#4a6180' }} />
          <span className="block w-4 h-[2px] rounded-full" style={{ background: '#4a6180' }} />
          <span className="block w-4 h-[2px] rounded-full" style={{ background: '#4a6180' }} />
        </button>
        {open && (
          <Link href="/" className="ml-3 flex items-center gap-2 whitespace-nowrap">
            <span className="text-base">🍩</span>
            <span className="text-sm font-bold" style={{ color: '#3dd68c' }}>Donut Casino</span>
          </Link>
        )}
      </div>

      {/* Games nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {open && (
          <p className="text-[10px] font-semibold uppercase tracking-widest px-4 mb-2" style={{ color: '#4a6180' }}>Games</p>
        )}
        <div className="space-y-0.5 px-2">
          {games.map(g => {
            const active = path === g.href
            return (
              <Link
                key={g.href}
                href={g.soon ? '#' : g.href}
                title={!open ? g.name : undefined}
                className="flex items-center rounded-lg transition-colors"
                style={{
                  gap: 10,
                  padding: open ? '8px 12px' : '8px 0',
                  justifyContent: open ? undefined : 'center',
                  background: active ? '#1a2d1f' : 'transparent',
                  color: active ? '#3dd68c' : g.soon ? '#2a3d52' : '#4a6180',
                  cursor: g.soon ? 'default' : 'pointer',
                  pointerEvents: g.soon ? 'none' : 'auto',
                }}
                onMouseEnter={e => { if (!active && !g.soon) { (e.currentTarget as HTMLElement).style.background = '#16202e'; (e.currentTarget as HTMLElement).style.color = '#c8d8e8' } }}
                onMouseLeave={e => { if (!active && !g.soon) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4a6180' } }}
              >
                <span className="text-lg shrink-0">{g.icon}</span>
                {open && (
                  <>
                    <span className="text-sm font-medium whitespace-nowrap flex-1">{g.name}</span>
                    {g.soon && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: '#16202e', color: '#2a3d52' }}>Soon</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
