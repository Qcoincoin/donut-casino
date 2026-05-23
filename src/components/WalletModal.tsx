'use client'
import { useState, useEffect } from 'react'

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000]

interface Props {
  playerId: string
  balance: number
  onClose: () => void
}

export default function WalletModal({ playerId, balance, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [step, setStep] = useState<'select' | 'done'>('select')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  function close() {
    setVisible(false)
    setTimeout(onClose, 250)
  }

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
    setTab(t); setStep('select'); setAmount(null); setCustom(''); setError('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ transition: 'background 0.25s', background: visible ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0)' }}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        className="bg-[#1a2030] border border-[#2d3748] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        style={{
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: visible ? 1 : 0
        }}
      >
        {/* Tab bar */}
        <div className="flex items-center bg-[#131720] border-b border-[#232b3e] px-2 pt-2">
          {(['deposit', 'withdraw'] as const).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`relative px-5 py-2.5 text-sm font-semibold capitalize transition-colors rounded-t-lg ${
                tab === t ? 'text-white' : 'text-[#8892a4] hover:text-white'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5c542] rounded-full" />
              )}
            </button>
          ))}
          <button
            onClick={close}
            className="ml-auto mr-2 mb-1 w-7 h-7 flex items-center justify-center rounded-lg text-[#8892a4] hover:text-white hover:bg-[#232b3e] transition-colors text-lg"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-4">
              {tab === 'deposit' ? (
                <>
                  <div>
                    <p className="text-[#8892a4] text-xs mb-3">Select or enter the amount you want to deposit:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {AMOUNTS.map(a => (
                        <button
                          key={a}
                          onClick={() => { setAmount(a); setCustom('') }}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            amount === a
                              ? 'bg-[#f5c542] text-[#0b0e14] border-[#f5c542]'
                              : 'bg-[#131720] text-[#c8d0e0] border-[#232b3e] hover:border-[#f5c542]/40'
                          }`}
                        >
                          {a >= 1000 ? `${a/1000}k` : a} DC
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(null) }}
                    placeholder="Custom amount..."
                    className="w-full bg-[#131720] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-3 text-white placeholder-[#8892a4] focus:outline-none transition-colors text-sm"
                  />
                  {finalAmount && finalAmount > 0 && (
                    <div className="bg-[#131720] border border-[#f5c542]/20 rounded-xl p-4">
                      <p className="text-[#8892a4] text-xs mb-2 flex items-center gap-1">
                        <span className="text-[#f5c542]">①</span> Run this in Donut SMP chat:
                      </p>
                      <div className="bg-[#0b0e14] rounded-lg px-4 py-3 font-mono text-[#f5c542] text-sm select-all cursor-copy border border-[#232b3e]">
                        /pay taurasone {finalAmount}
                      </div>
                      <p className="text-[#8892a4] text-xs mt-2 flex items-center gap-1">
                        <span className="text-[#f5c542]">②</span> Then click the button below
                      </p>
                    </div>
                  )}
                  <button
                    onClick={submitDeposit}
                    disabled={!finalAmount || finalAmount < 1 || loading}
                    className="w-full bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm"
                  >
                    {loading ? 'Submitting...' : "I've sent the payment →"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#8892a4] text-xs">
                    Balance: <span className="text-[#f5c542] font-semibold">{balance.toLocaleString()} DC</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {AMOUNTS.filter(a => a <= balance).map(a => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustom('') }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                          amount === a
                            ? 'bg-[#f5c542] text-[#0b0e14] border-[#f5c542]'
                            : 'bg-[#131720] text-[#c8d0e0] border-[#232b3e] hover:border-[#f5c542]/40'
                        }`}
                      >
                        {a >= 1000 ? `${a/1000}k` : a} DC
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(null) }}
                    placeholder="Custom amount..."
                    max={balance}
                    className="w-full bg-[#131720] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-3 text-white placeholder-[#8892a4] focus:outline-none transition-colors text-sm"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    onClick={submitWithdraw}
                    disabled={!finalAmount || finalAmount < 1 || loading}
                    className="w-full bg-[#f5c542] hover:bg-[#e6b800] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm"
                  >
                    {loading ? 'Submitting...' : 'Request Withdrawal →'}
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">{tab === 'deposit' ? '⏳' : '✅'}</div>
              <h3 className="text-lg font-bold text-white mb-2">
                {tab === 'deposit' ? 'Deposit Pending' : 'Withdrawal Submitted'}
              </h3>
              <p className="text-[#8892a4] text-sm mb-6">
                {tab === 'deposit'
                  ? `${finalAmount?.toLocaleString()} DC will be credited once confirmed.`
                  : `${finalAmount?.toLocaleString()} DC withdrawal is being processed.`}
              </p>
              <button onClick={close} className="bg-[#131720] hover:bg-[#232b3e] border border-[#232b3e] text-white font-semibold px-8 py-2.5 rounded-xl transition-colors text-sm">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
