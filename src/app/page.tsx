'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/LoginModal'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import WalletModal from '@/components/WalletModal'

interface Player {
  id: string
  username: string
  balance: number
}

const GAMES = [
  { name: 'Coin Flip', icon: '🪙', href: '/games/coinflip', desc: 'Double or nothing', color: 'from-yellow-500/20 to-yellow-600/5' },
  { name: 'Dice Roll', icon: '🎲', href: '#', desc: 'Roll the dice', color: 'from-blue-500/20 to-blue-600/5', soon: true },
  { name: 'Slots', icon: '🎰', href: '#', desc: 'Spin to win', color: 'from-purple-500/20 to-purple-600/5', soon: true },
  { name: 'Blackjack', icon: '🃏', href: '#', desc: 'Beat the dealer', color: 'from-green-500/20 to-green-600/5', soon: true },
  { name: 'Roulette', icon: '🎡', href: '#', desc: 'Pick your number', color: 'from-red-500/20 to-red-600/5', soon: true },
  { name: 'Crash', icon: '📈', href: '#', desc: 'Cash out in time', color: 'from-orange-500/20 to-orange-600/5', soon: true },
  { name: 'Mines', icon: '💣', href: '#', desc: 'Avoid the mines', color: 'from-pink-500/20 to-pink-600/5', soon: true },
  { name: 'Hi-Lo', icon: '🔼', href: '#', desc: 'Higher or lower', color: 'from-cyan-500/20 to-cyan-600/5', soon: true },
]

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [showWallet, setShowWallet] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('donut_player')
    if (saved) setPlayer(JSON.parse(saved))
  }, [])

  const refreshBalance = useCallback(async (p: Player) => {
    const res = await fetch(`/api/balance?playerId=${p.id}`)
    const data = await res.json()
    const updated = { ...p, balance: data.balance }
    setPlayer(updated)
    localStorage.setItem('donut_player', JSON.stringify(updated))
  }, [])

  useEffect(() => {
    if (!player) return
    const interval = setInterval(() => refreshBalance(player), 15000)
    return () => clearInterval(interval)
  }, [player, refreshBalance])

  function handleLogin(p: Player) {
    setPlayer(p)
    localStorage.setItem('donut_player', JSON.stringify(p))
  }

  function handleLogout() {
    setPlayer(null)
    localStorage.removeItem('donut_player')
  }

  function handleWalletClose() {
    setShowWallet(false)
    if (player) refreshBalance(player)
  }

  if (!player) return <LoginModal onLogin={handleLogin} />

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header player={player} onWallet={() => setShowWallet(true)} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, <span className="text-[#f5c542]">{player.username}</span>!</h1>
              <p className="text-[#8892a4] text-sm">Pick a game and start playing with your Donut Coins.</p>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">🎮 Games</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GAMES.map(g => (
                <Link
                  key={g.name}
                  href={g.href}
                  className={`relative bg-gradient-to-br ${g.color} bg-[#131720] border border-[#232b3e] rounded-2xl p-5 flex flex-col items-center text-center transition-all ${
                    g.soon ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#f5c542]/40 hover:scale-[1.02]'
                  }`}
                >
                  {g.soon && (
                    <span className="absolute top-2 right-2 text-[10px] bg-[#232b3e] text-[#8892a4] px-2 py-0.5 rounded-full">Soon</span>
                  )}
                  <div className="text-4xl mb-3">{g.icon}</div>
                  <div className="font-bold text-white text-sm">{g.name}</div>
                  <div className="text-[#8892a4] text-xs mt-1">{g.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      {showWallet && <WalletModal playerId={player.id} balance={player.balance} onClose={handleWalletClose} />}
    </div>
  )
}
