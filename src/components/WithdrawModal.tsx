'use client'
import { useState } from 'react'

interface Props {
  playerId: string
  balance: number
  onClose: () => void
}

export default function WithdrawModal({ playerId, balance, onClose }: Props) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'pending'>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    const amt = parseInt(amount)
    if (!amt || amt < 1) return
    if (amt > balance) { setError('Not enough balance'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: amt })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('pending')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-yellow-400">Withdraw DC</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {step === 'input' && (
          <>
            <p className="text-gray-400 text-sm mb-1">Available balance: <span className="text-yellow-400 font-semibold">{balance.toLocaleString()} DC</span></p>
            <p className="text-gray-500 text-xs mb-4">I'll pay you in-game once the request is confirmed.</p>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount to withdraw..."
              max={balance}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 mb-2"
            />
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button
              onClick={submit}
              disabled={!amount || parseInt(amount) < 1 || loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Submitting...' : 'Request Withdrawal'}
            </button>
          </>
        )}

        {step === 'pending' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-white mb-2">Withdrawal Pending</h3>
            <p className="text-gray-400 text-sm mb-2">Your withdrawal of <span className="text-yellow-400 font-semibold">{parseInt(amount).toLocaleString()} DC</span> is being processed.</p>
            <p className="text-gray-500 text-xs mb-6">I'll pay you in-game and confirm shortly.</p>
            <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
