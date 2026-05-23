'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import WalletModal from '@/components/WalletModal'
import LoginModal from '@/components/LoginModal'

interface Player { id: string; username: string; balance: number }

const GAMES = [
  { name: 'Coin Flip', icon: '🪙', href: '/games/coinflip', desc: 'Double or nothing', color: 'from-yellow-500/10 to-transparent' },
  { name: 'Dice Roll', icon: '🎲', href: '#', desc: 'Roll the dice', color: 'from-blue-500/10 to-transparent', soon: true },
  { name: 'Slots', icon: '🎰', href: '#', desc: 'Spin to win', color: 'from-purple-500/10 to-transparent', soon: true },
  { name: 'Blackjack', icon: '🃏', href: '#', desc: 'Beat the dealer', color: 'from-green-500/10 to-transparent', soon: true },
  { name: 'Roulette', icon: '🎡', href: '#', desc: 'Pick your number', color: 'from-red-500/10 to-transparent', soon: true },
  { name: 'Crash', icon: '📈', href: '#', desc: 'Cash out in time', color: 'from-orange-500/10 to-transparent', soon: true },
  { name: 'Mines', icon: '💣', href: '#', desc: 'Avoid the mines', color: 'from-pink-500/10 to-transparent', soon: true },
  { name: 'Hi-Lo', icon: '🔼', href: '#', desc: 'Higher or lower', color: 'from-cyan-500/10 to-transparent', soon: true },
]

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [showWallet, setShowWallet] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

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
    setShowLogin(false)
  }

  function handleLogout() {
    setPlayer(null)
    localStorage.removeItem('donut_player')
  }

  function handleWalletClose() {
    setShowWallet(false)
    if (player) refreshBalance(player)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1219]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          player={player}
          onWallet={() => player && setShowWallet(true)}
          onLogin={() => setShowLogin(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {player ? (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, <span className="text-[#3dd68c]">{player.username}</span>!</h1>
                <p className="text-[#4a6180] text-sm">Pick a game and start playing with your Donut Coins.</p>
              </div>
            ) : (
              <div className="mb-8 bg-[#0f1923] border border-[#1e2d3d] rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1">🍩 Donut SMP Casino</h1>
                  <p className="text-[#4a6180] text-sm">Login with your Minecraft username to start playing.</p>
                </div>
                <button onClick={() => setShowLogin(true)}
                  className="bg-[#3dd68c] hover:bg-[#2fc47a] text-[#0b0e14] font-bold px-6 py-2.5 rounded-xl text-sm transition-all active:scale-95 shrink-0">
                  Login / Sign Up
                </button>
              </div>
            )}

            <h2 className="text-sm font-semibold text-[#4a6180] uppercase tracking-widest mb-4">Games</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GAMES.map(g => (
                <Link
                  key={g.name}
                  href={!player || g.soon ? '#' : g.href}
                  onClick={e => { if (!player && !g.soon) { e.preventDefault(); setShowLogin(true) } }}
                  className={`relative bg-gradient-to-br ${g.color} bg-[#0f1923] border border-[#1e2d3d] rounded-2xl p-5 flex flex-col items-center text-center transition-all group ${
                    g.soon ? 'opacity-40 cursor-not-allowed' : 'hover:border-[#3dd68c]/30 hover:scale-[1.02] cursor-pointer'
                  }`}
                >
                  {g.soon && (
                    <span className="absolute top-2 right-2 text-[9px] bg-[#1e2d3d] text-[#4a6180] px-2 py-0.5 rounded-full font-semibold tracking-wide">SOON</span>
                  )}
                  <div className="text-4xl mb-3">{g.icon}</div>
                  <div className="font-bold text-white text-sm">{g.name}</div>
                  <div className="text-[#4a6180] text-xs mt-1">{g.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      {showWallet && player && <WalletModal playerId={player.id} balance={player.balance} onClose={handleWalletClose} />}
    </div>
  )
}
