'use client'

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
    <header className="h-14 bg-[#131720] border-b border-[#232b3e] flex items-center px-6 sticky top-0 z-40">
      {/* Left: spacer */}
      <div className="flex-1" />

      {/* Center: balance + wallet */}
      <div className="flex items-center gap-2">
        <button
          onClick={onWallet}
          className="flex items-center gap-2 bg-[#1a2030] hover:bg-[#232b3e] border border-[#232b3e] hover:border-[#f5c542]/30 rounded-lg px-4 py-1.5 transition-all"
        >
          <span className="text-[#f5c542] font-bold text-sm">{player.balance.toLocaleString()} DC</span>
          <span className="text-[#8892a4] text-xs">▾</span>
        </button>
        <button
          onClick={onWallet}
          className="bg-[#f5c542] hover:bg-[#e6b800] active:scale-95 text-[#0b0e14] font-bold px-5 py-1.5 rounded-lg text-sm transition-all"
        >
          💰 Wallet
        </button>
      </div>

      {/* Right: user */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="flex items-center gap-2 text-sm text-[#c8d0e0]">
          <div className="w-7 h-7 rounded-full bg-[#f5c542]/20 border border-[#f5c542]/30 flex items-center justify-center text-xs font-bold text-[#f5c542]">
            {player.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium">{player.username}</span>
        </div>
        <button
          onClick={onLogout}
          className="text-[#8892a4] hover:text-white text-xs transition-colors px-2 py-1 rounded hover:bg-[#1a2030]"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
