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
      className="shrink-0 bg-[#131720] border-r border-[#232b3e] flex flex-col h-screen sticky top-0 transition-all duration-300 overflow-hidden"
      style={{ width: open ? 200 : 56 }}
    >
      {/* Toggle */}
      <div className="h-14 flex items-center border-b border-[#232b3e] px-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[#1a2030] transition-colors shrink-0"
        >
          <span className="block w-4 h-0.5 bg-[#8892a4]" />
          <span className="block w-4 h-0.5 bg-[#8892a4]" />
          <span className="block w-4 h-0.5 bg-[#8892a4]" />
        </button>
        {open && (
          <Link href="/" className="ml-2 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-lg">🍩</span>
            <span className="text-sm font-bold text-[#f5c542]">Donut Casino</span>
          </Link>
        )}
      </div>

      {/* Games */}
      <nav className="flex-1 overflow-y-auto py-3">
        {open && (
          <p className="text-[#8892a4] text-[10px] font-semibold uppercase tracking-wider px-4 mb-2">Games</p>
        )}
        <div className="space-y-0.5 px-2">
          {games.map(g => {
            const active = path === g.href
            return (
              <Link
                key={g.href}
                href={g.soon ? '#' : g.href}
                title={!open ? g.name : undefined}
                className={`flex items-center gap-3 rounded-lg transition-colors ${open ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'} ${
                  active
                    ? 'bg-[#f5c542]/10 text-[#f5c542]'
                    : g.soon
                    ? 'text-[#8892a4]/50 cursor-default'
                    : 'text-[#8892a4] hover:bg-[#1a2030] hover:text-white'
                }`}
              >
                <span className="text-lg shrink-0">{g.icon}</span>
                {open && (
                  <>
                    <span className="text-sm font-medium whitespace-nowrap">{g.name}</span>
                    {g.soon && (
                      <span className="ml-auto text-[9px] bg-[#232b3e] text-[#8892a4] px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
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
