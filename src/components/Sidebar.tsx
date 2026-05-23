'use client'
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
  const path = usePathname()
  return (
    <aside className="w-56 shrink-0 bg-[#131720] border-r border-[#232b3e] flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-[#232b3e]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍩</span>
          <span className="text-lg font-bold text-[#f5c542]">Donut Casino</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="text-[#8892a4] text-xs font-semibold uppercase tracking-wider px-2 mb-2">Games</p>
        <div className="space-y-0.5">
          {games.map(g => (
            <Link
              key={g.href}
              href={g.soon ? '#' : g.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path === g.href
                  ? 'bg-[#f5c542]/10 text-[#f5c542]'
                  : g.soon
                  ? 'text-[#8892a4] cursor-default'
                  : 'text-[#c8d0e0] hover:bg-[#1a2030] hover:text-white'
              }`}
            >
              <span className="text-lg">{g.icon}</span>
              <span>{g.name}</span>
              {g.soon && <span className="ml-auto text-[10px] bg-[#232b3e] text-[#8892a4] px-1.5 py-0.5 rounded">Soon</span>}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  )
}
