'use client'
import { useState, useEffect, useCallback } from 'react'

interface Deposit {
  id: string
  amount: number
  created_at: string
  players: { username: string }
}

interface Withdrawal {
  id: string
  amount: number
  created_at: string
  players: { username: string }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState('')
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPending = useCallback(async () => {
    const [d, w] = await Promise.all([
      fetch('/api/admin/deposits').then(r => r.json()),
      fetch('/api/admin/withdrawals').then(r => r.json())
    ])
    setDeposits(d.deposits ?? [])
    setWithdrawals(w.withdrawals ?? [])
  }, [])

  useEffect(() => {
    if (authed) {
      fetchPending()
      const interval = setInterval(fetchPending, 10000)
      return () => clearInterval(interval)
    }
  }, [authed, fetchPending])

  async function login() {
    setLoginError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin })
    })
    if (res.ok) {
      setAuthed(true)
    } else {
      setLoginError('Invalid credentials')
    }
  }

  async function handleDeposit(id: string, action: 'confirm' | 'reject') {
    setLoading(true)
    await fetch('/api/admin/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ depositId: id, action })
    })
    await fetchPending()
    setLoading(false)
  }

  async function handleWithdrawal(id: string, action: 'confirm' | 'reject') {
    setLoading(true)
    await fetch('/api/admin/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withdrawalId: id, action })
    })
    await fetchPending()
    setLoading(false)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔐</div>
            <h1 className="text-xl font-bold text-red-400">Admin Panel</h1>
          </div>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-3"
          />
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="PIN"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-3"
          />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
          <button
            onClick={login}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  const total = deposits.length + withdrawals.length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-red-400">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Donut Casino</p>
          </div>
          {total > 0 && (
            <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full animate-pulse">
              {total} pending
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-green-400 mb-3">
            Deposits ({deposits.length})
          </h2>
          {deposits.length === 0 ? (
            <p className="text-gray-600 text-sm">No pending deposits.</p>
          ) : (
            <div className="space-y-3">
              {deposits.map(d => (
                <div key={d.id} className="bg-gray-900 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{d.players.username}</span>
                    <span className="text-gray-400 text-sm"> wants to deposit </span>
                    <span className="text-green-400 font-bold">{d.amount.toLocaleString()} DC</span>
                    <p className="text-gray-600 text-xs mt-1">{new Date(d.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeposit(d.id, 'confirm')}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDeposit(d.id, 'reject')}
                      disabled={loading}
                      className="bg-gray-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-yellow-400 mb-3">
            Withdrawals ({withdrawals.length})
          </h2>
          {withdrawals.length === 0 ? (
            <p className="text-gray-600 text-sm">No pending withdrawals.</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map(w => (
                <div key={w.id} className="bg-gray-900 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{w.players.username}</span>
                    <span className="text-gray-400 text-sm"> wants to withdraw </span>
                    <span className="text-yellow-400 font-bold">{w.amount.toLocaleString()} DC</span>
                    <p className="text-gray-600 text-xs mt-1">{new Date(w.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWithdrawal(w.id, 'confirm')}
                      disabled={loading}
                      className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleWithdrawal(w.id, 'reject')}
                      disabled={loading}
                      className="bg-gray-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
