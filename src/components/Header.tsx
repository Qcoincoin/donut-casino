'use client'
import { formatBalance } from '@/lib/format'

interface Player {
  id: string
  username: string
  balance: number
}

interface Props {
  player: Player
  onWallet: () => void
  onLogout: () => void
}

export default function Header({ player, onWallet, onLogout }: Props) {
  return (
    <header className="h-14 flex items-center px-6 shrink-0" style={{ background: '#0f1923', borderBottom: '1px solid #1e2d3d' }}>
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Center: balance pill + wallet button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
          style={{ background: '#16202e', border: '1px solid #1e2d3d' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#3dd68c44')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e2d3d')}
        >
          <span className="text-sm font-medium" style={{ color: '#4a6180' }}>$</span>
          <span className="text-white font-bold text-sm">{formatBalance(player.balance)}</span>
        </button>

        <button
          onClick={onWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ background: '#3dd68c', color: '#0b0e14' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2fc47a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#3dd68c')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M16 12h.01"/>
            <path d="M2 10h20"/>
          </svg>
          Wallet
        </button>
      </div>

      {/* Right: user info */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#1e2d3d', color: '#3dd68c', border: '1px solid #3dd68c33' }}
          >
            {player.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium" style={{ color: '#c8d8e8' }}>{player.username}</span>
        </div>
        <button
          onClick={onLogout}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#4a6180' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#16202e' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a6180'; e.currentTarget.style.background = 'transparent' }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
