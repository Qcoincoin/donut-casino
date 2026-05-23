'use client'
import { useState } from 'react'

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000]

interface Props {
  playerId: string
  balance: number
  onClose: () => void
}

export default function WalletModal({ playerId, balance, onClose }: Props) {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [step, setStep] = useState<'select' | 'done'>('select')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = amount ?? (custom ? parseInt(custom) : null)

  async function submitDeposit() {
    if (!finalAmount || finalAmount < 1) return
    setLoading(true)
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: finalAmount })
    })
    if (res.ok) setStep('done')
    setLoading(false)
  }

  async function submitWithdraw() {
    if (!finalAmount || finalAmount < 1) return
    if (finalAmount > balance) { setError('Insufficient balance'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: finalAmount })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('done')
    setLoading(false)
  }

  function switchTab(t: 'deposit' | 'withdraw') {
    setTab(t)
    setStep('select')
    setAmount(null)
    setCustom('')
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#131720] border border-[#232b3e] rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Tabs */}
        <div className="flex items-center border-b border-[#232b3e] px-6 pt-4 gap-1">
          {(['deposit', 'withdraw'] as const).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors capitalize ${
                tab === t
                  ? 'bg-[#f5c542] text-[#0b0e14]'
                  : 'text-[#8892a4] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
          <button onClick={onClose} className="ml-auto text-[#8892a4] hover:text-white text-xl pb-2">×</button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              {tab === 'deposit' && (
                <>
                  <p className="text-[#8892a4] text-sm mb-4">Select amount to deposit via in-game payment:</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {AMOUNTS.map(a => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustom('') }}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                          amount === a
                            ? 'bg-[#f5c542] text-[#0b0e14] scale-105'
                            : 'bg-[#1a2030] text-white hover:bg-[#232b3e] border border-[#232b3e]'
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
                    className="w-full bg-[#1a2030] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-3 text-white placeholder-[#8892a4] focus:outline-none mb-4 transition-colors"
                  />
                  {finalAmount && finalAmount > 0 && (
                    <div className="bg-[#1a2030] border border-[#f5c542]/20 rounded-xl p-4 mb-4">
                      <p className="text-[#8892a4] text-xs mb-2">① Send this command in Donut SMP chat:</p>
                      <div className="bg-[#0b0e14] rounded-lg px-4 py-3 font-mono text-[#f5c542] text-sm select-all cursor-copy">
                        /pay taurasone {finalAmount}
                      </div>
                      <p className="text-[#8892a4] text-xs mt-2">② Click the button below once you've sent it.</p>
                    </div>
                  )}
                  <button
                    onClick={submitDeposit}
                    disabled={!finalAmount || finalAmount < 1 || loading}
                    className="w-full bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-colors"
                  >
                    {loading ? 'Submitting...' : "I've sent the payment →"}
                  </button>
                </>
              )}

              {tab === 'withdraw' && (
                <>
                  <p className="text-[#8892a4] text-sm mb-1">Available: <span className="text-[#f5c542] font-semibold">{balance.toLocaleString()} DC</span></p>
                  <p className="text-[#8892a4] text-xs mb-4">I'll pay you in-game after confirming your request.</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {AMOUNTS.filter(a => a <= balance).map(a => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustom('') }}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                          amount === a
                            ? 'bg-[#f5c542] text-[#0b0e14] scale-105'
                            : 'bg-[#1a2030] text-white hover:bg-[#232b3e] border border-[#232b3e]'
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
                    max={balance}
                    className="w-full bg-[#1a2030] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-3 text-white placeholder-[#8892a4] focus:outline-none mb-2 transition-colors"
                  />
                  {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                  <button
                    onClick={submitWithdraw}
                    disabled={!finalAmount || finalAmount < 1 || loading}
                    className="w-full bg-[#f5c542] hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-colors mt-2"
                  >
                    {loading ? 'Submitting...' : 'Request Withdrawal →'}
                  </button>
                </>
              )}
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">{tab === 'deposit' ? '⏳' : '✅'}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {tab === 'deposit' ? 'Deposit Pending' : 'Withdrawal Requested'}
              </h3>
              <p className="text-[#8892a4] text-sm mb-6">
                {tab === 'deposit'
                  ? `Your deposit of ${finalAmount?.toLocaleString()} DC is waiting for confirmation.`
                  : `Your withdrawal of ${finalAmount?.toLocaleString()} DC has been submitted.`}
              </p>
              <button onClick={onClose} className="bg-[#1a2030] hover:bg-[#232b3e] text-white font-semibold px-8 py-2.5 rounded-xl transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
