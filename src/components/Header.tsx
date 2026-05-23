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
          className="flex items-center gap-1.5 bg-[#1a2030] hover:bg-[#232b3e] border border-[#232b3e] hover:border-[#3dd68c]/30 rounded-lg px-3 py-1.5 transition-all"
        >
          <span className="text-[#8892a4] text-sm font-medium">$</span>
          <span className="text-white font-bold text-sm">{player.balance.toLocaleString()}</span>
        </button>
        <button
          onClick={onWallet}
          className="bg-[#3dd68c] hover:bg-[#2fc47a] active:scale-95 text-[#0b0e14] font-bold px-4 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V22H4V12"/>
            <path d="M22 7H2v5h20V7z"/>
            <path d="M12 22V7"/>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
          Wallet
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
