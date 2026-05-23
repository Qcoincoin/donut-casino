'use client'
import { useState, useEffect, useCallback } from 'react'
import LoginModal from '@/components/LoginModal'
import DepositModal from '@/components/DepositModal'
import WithdrawModal from '@/components/WithdrawModal'

interface Player {
  id: string
  username: string
  balance: number
}

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

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

  function handleModalClose() {
    setShowDeposit(false)
    setShowWithdraw(false)
    if (player) refreshBalance(player)
  }

  if (!player) return <LoginModal onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-yellow-500/20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍩</span>
            <span className="text-xl font-bold text-yellow-400">Donut Casino</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-sm">Balance: </span>
              <span className="text-yellow-400 font-bold">{player.balance.toLocaleString()} DC</span>
            </div>
            <button
              onClick={() => setShowDeposit(true)}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Deposit
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Withdraw
            </button>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-200 mb-2">Welcome, <span className="text-yellow-400">{player.username}</span>!</h2>
        <p className="text-gray-500">Games coming soon. Deposit DC to get started.</p>
      </main>

      {showDeposit && <DepositModal playerId={player.id} onClose={handleModalClose} />}
      {showWithdraw && <WithdrawModal playerId={player.id} balance={player.balance} onClose={handleModalClose} />}
    </div>
  )
}
