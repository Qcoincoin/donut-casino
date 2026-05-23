'use client'
import { useState } from 'react'

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000]

interface Props {
  playerId: string
  onClose: () => void
}

export default function DepositModal({ playerId, onClose }: Props) {
  const [amount, setAmount] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [step, setStep] = useState<'select' | 'pending'>('select')
  const [loading, setLoading] = useState(false)

  const finalAmount = amount ?? (custom ? parseInt(custom) : null)

  async function submit() {
    if (!finalAmount || finalAmount < 1) return
    setLoading(true)
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: finalAmount })
    })
    if (res.ok) setStep('pending')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-yellow-400">Deposit DC</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {step === 'select' && (
          <>
            <p className="text-gray-400 text-sm mb-4">Select or enter an amount to deposit:</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustom('') }}
                  className={`py-3 rounded-xl font-semibold transition-colors ${
                    amount === a
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {a.toLocaleString()} DC
                </button>
              ))}
            </div>
            <input
              type="number"
              value={custom}
              onChange={e => { setCustom(e.target.value); setAmount(null) }}
              placeholder="Custom amount..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 mb-4"
            />
            {finalAmount && finalAmount > 0 && (
              <div className="bg-gray-800 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Send this command in Donut SMP chat:</p>
                <div className="bg-gray-950 rounded-lg px-4 py-3 font-mono text-yellow-400 text-sm select-all">
                  /pay taurasone {finalAmount}
                </div>
                <p className="text-gray-500 text-xs mt-2">Your deposit will appear as pending until I confirm it in-game.</p>
              </div>
            )}
            <button
              onClick={submit}
              disabled={!finalAmount || finalAmount < 1 || loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Submitting...' : "I've sent the payment"}
            </button>
          </>
        )}

        {step === 'pending' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-white mb-2">Deposit Pending</h3>
            <p className="text-gray-400 text-sm mb-2">Your deposit of <span className="text-yellow-400 font-semibold">{finalAmount?.toLocaleString()} DC</span> is waiting for confirmation.</p>
            <p className="text-gray-500 text-xs mb-6">I'll verify your payment in-game and credit your balance shortly.</p>
            <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
