'use client'
import { formatBalance } from '@/lib/format'

interface Player { id: string; username: string; balance: number }

interface Props {
  player: Player | null
  onWallet: () => void
  onLogin: () => void
  onLogout: () => void
}

export default function Header({ player, onWallet, onLogin, onLogout }: Props) {
  return (
    <header className="h-14 bg-[#0f1923] border-b border-[#1e2d3d] flex items-center px-6 shrink-0 sticky top-0 z-40">
      <div className="flex-1" />

      {/* Center */}
      <div className="flex items-center gap-2">
        {player ? (
          <>
            <button onClick={onWallet}
              className="flex items-center gap-2 bg-[#16202e] hover:bg-[#1e2d3d] border border-[#1e2d3d] hover:border-[#3dd68c]/30 rounded-xl px-4 py-2 transition-all">
              <span className="text-[#4a6180] text-sm font-medium">$</span>
              <span className="text-white font-bold text-sm">{formatBalance(player.balance)}</span>
            </button>
            <button onClick={onWallet}
              className="flex items-center gap-2 bg-[#3dd68c] hover:bg-[#2fc47a] active:scale-95 text-[#0b0e14] font-bold px-4 py-2 rounded-xl text-sm transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M16 12h.01"/><path d="M2 10h20"/>
              </svg>
              Wallet
            </button>
          </>
        ) : (
          <button onClick={onLogin}
            className="bg-[#3dd68c] hover:bg-[#2fc47a] active:scale-95 text-[#0b0e14] font-bold px-5 py-2 rounded-xl text-sm transition-all">
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {player ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1e2d3d] border border-[#3dd68c]/20 flex items-center justify-center text-xs font-bold text-[#3dd68c]">
                {player.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#c8d8e8]">{player.username}</span>
            </div>
            <button onClick={onLogout}
              className="text-[#4a6180] hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#16202e] transition-all">
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-[#4a6180] text-xs">
            <span>🍩</span>
            <span>Donut SMP Casino</span>
          </div>
        )}
      </div>
    </header>
  )
}
