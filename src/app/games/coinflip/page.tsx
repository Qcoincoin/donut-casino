'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import WalletModal from '@/components/WalletModal'

interface Player { id: string; username: string; balance: number }

const QUICK_BETS = [50, 100, 250, 500, 1000]

export default function CoinFlipPage() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [showWallet, setShowWallet] = useState(false)
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads')
  const [bet, setBet] = useState(100)
  const [betInput, setBetInput] = useState('100')
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<{ result: 'heads' | 'tails'; won: boolean; payout: number } | null>(null)
  const [coinFace, setCoinFace] = useState<'heads' | 'tails'>('heads')

  useEffect(() => {
    const saved = localStorage.getItem('donut_player')
    if (!saved) { router.push('/'); return }
    setPlayer(JSON.parse(saved))
  }, [router])

  const refreshBalance = useCallback(async (p: Player) => {
    const res = await fetch(`/api/balance?playerId=${p.id}`)
    const data = await res.json()
    const updated = { ...p, balance: data.balance }
    setPlayer(updated)
    localStorage.setItem('donut_player', JSON.stringify(updated))
    return updated
  }, [])

  function handleLogout() {
    localStorage.removeItem('donut_player')
    router.push('/')
  }

  function setBetValue(v: number) {
    const clamped = Math.max(1, v)
    setBet(clamped)
    setBetInput(String(clamped))
  }

  async function flip() {
    if (!player || flipping || bet < 1 || bet > player.balance) return
    setFlipping(true)
    setResult(null)

    // animate coin
    let flips = 0
    const interval = setInterval(() => {
      setCoinFace(f => f === 'heads' ? 'tails' : 'heads')
      flips++
      if (flips > 10) clearInterval(interval)
    }, 80)

    const res = await fetch('/api/games/coinflip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: player.id, bet, choice })
    })
    const data = await res.json()

    clearInterval(interval)
    setCoinFace(data.result)
    setResult(data)
    setFlipping(false)

    const updated = await refreshBalance(player)
    setPlayer(updated)
  }

  if (!player) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header player={player} onWallet={() => setShowWallet(true)} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#8892a4] text-sm">
              <span>🏠 Home</span>
              <span>/</span>
              <span className="text-white">Coin Flip</span>
            </div>

            <div className="bg-[#131720] border border-[#232b3e] rounded-2xl overflow-hidden">
              {/* Coin display */}
              <div className="bg-gradient-to-b from-[#1a2030] to-[#131720] p-10 flex flex-col items-center">
                <div className={`text-8xl mb-4 transition-all duration-100 ${flipping ? 'scale-90 opacity-80' : 'scale-100'}`}>
                  {coinFace === 'heads' ? '🟡' : '⚪'}
                </div>
                <div className="text-2xl font-bold text-white capitalize mb-1">
                  {flipping ? '...' : coinFace}
                </div>

                {result && !flipping && (
                  <div className={`mt-3 px-6 py-2 rounded-full font-bold text-lg ${result.won ? 'bg-[#3dd68c]/20 text-[#3dd68c]' : 'bg-red-500/20 text-red-400'}`}>
                    {result.won ? `+${result.payout.toLocaleString()} DC` : `-${Math.abs(result.payout).toLocaleString()} DC`}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-6 space-y-5">
                {/* Side choice */}
                <div>
                  <label className="text-[#8892a4] text-xs font-semibold uppercase tracking-wider mb-2 block">Pick Side</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setChoice('heads')}
                      className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        choice === 'heads'
                          ? 'bg-[#f5c542] text-[#0b0e14]'
                          : 'bg-[#1a2030] text-[#c8d0e0] border border-[#232b3e] hover:border-[#f5c542]/40'
                      }`}
                    >
                      🟡 Heads
                    </button>
                    <button
                      onClick={() => setChoice('tails')}
                      className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        choice === 'tails'
                          ? 'bg-[#8892a4] text-white'
                          : 'bg-[#1a2030] text-[#c8d0e0] border border-[#232b3e] hover:border-[#8892a4]/40'
                      }`}
                    >
                      ⚪ Tails
                    </button>
                  </div>
                </div>

                {/* Bet amount */}
                <div>
                  <label className="text-[#8892a4] text-xs font-semibold uppercase tracking-wider mb-2 block">Bet Amount</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      value={betInput}
                      onChange={e => { setBetInput(e.target.value); setBet(parseInt(e.target.value) || 0) }}
                      className="flex-1 bg-[#1a2030] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                    />
                    <button onClick={() => setBetValue(Math.floor(bet / 2))} className="bg-[#1a2030] border border-[#232b3e] hover:border-[#f5c542]/30 text-[#8892a4] hover:text-white px-3 rounded-xl text-sm transition-colors">½</button>
                    <button onClick={() => setBetValue(bet * 2)} className="bg-[#1a2030] border border-[#232b3e] hover:border-[#f5c542]/30 text-[#8892a4] hover:text-white px-3 rounded-xl text-sm transition-colors">2×</button>
                    <button onClick={() => setBetValue(player.balance)} className="bg-[#1a2030] border border-[#232b3e] hover:border-[#f5c542]/30 text-[#8892a4] hover:text-white px-3 rounded-xl text-sm transition-colors">Max</button>
                  </div>
                  <div className="flex gap-2">
                    {QUICK_BETS.map(q => (
                      <button
                        key={q}
                        onClick={() => setBetValue(q)}
                        className="flex-1 bg-[#1a2030] border border-[#232b3e] hover:border-[#f5c542]/30 text-[#8892a4] hover:text-white py-1.5 rounded-lg text-xs transition-colors"
                      >
                        {q >= 1000 ? `${q/1000}k` : q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payout info */}
                <div className="flex justify-between text-sm text-[#8892a4] bg-[#1a2030] rounded-xl px-4 py-3">
                  <span>Win chance</span><span className="text-white font-semibold">50%</span>
                  <span className="mx-4">|</span>
                  <span>Payout</span><span className="text-[#3dd68c] font-semibold">2× ({(bet * 2).toLocaleString()} DC)</span>
                </div>

                <button
                  onClick={flip}
                  disabled={flipping || bet < 1 || bet > player.balance}
                  className="w-full bg-[#f5c542] hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-4 rounded-xl text-lg transition-colors"
                >
                  {flipping ? 'Flipping...' : `Flip Coin`}
                </button>

                {bet > player.balance && (
                  <p className="text-red-400 text-sm text-center">Insufficient balance. <button onClick={() => setShowWallet(true)} className="underline">Deposit DC</button></p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {showWallet && <WalletModal playerId={player.id} balance={player.balance} onClose={() => { setShowWallet(false); refreshBalance(player) }} />}
    </div>
  )
}
