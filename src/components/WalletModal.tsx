'use client'
import { useState, useEffect } from 'react'

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000]

interface Transaction {
  id: string
  amount: number
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
}

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [deposits, setDeposits] = useState<Transaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([])

  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  useEffect(() => {
    fetch(`/api/transactions?playerId=${playerId}`)
      .then(r => r.json())
      .then(d => { setDeposits(d.deposits ?? []); setWithdrawals(d.withdrawals ?? []) })
  }, [playerId, submitted])

  function close() { setVisible(false); setTimeout(onClose, 250) }

  const finalAmount = amount ?? (custom ? parseInt(custom) : null)

  async function submitDeposit() {
    if (!finalAmount || finalAmount < 1) return
    setLoading(true)
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: finalAmount })
    })
    if (res.ok) { setSubmitted(true); setAmount(null); setCustom('') }
    setLoading(false)
  }

  async function submitWithdraw() {
    if (!finalAmount || finalAmount < 1) return
    if (finalAmount > balance) { setError('Insufficient balance'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, amount: finalAmount })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setSubmitted(true); setAmount(null); setCustom('')
    setLoading(false)
  }

  function switchTab(t: 'deposit' | 'withdraw') {
    setTab(t); setSubmitted(false); setAmount(null); setCustom(''); setError('')
  }

  const statusBadge = (s: string) => {
    if (s === 'confirmed') return <span className="text-[10px] bg-[#3dd68c]/20 text-[#3dd68c] px-2 py-0.5 rounded-full font-semibold">Confirmed</span>
    if (s === 'rejected') return <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">Rejected</span>
    return <span className="text-[10px] bg-[#f5c542]/20 text-[#f5c542] px-2 py-0.5 rounded-full font-semibold">Pending</span>
  }

  const txList = tab === 'deposit' ? deposits : withdrawals

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
            <button key={t} onClick={() => switchTab(t)}
              className={`relative px-5 py-2.5 text-sm font-semibold capitalize transition-colors rounded-t-lg ${tab === t ? 'text-white' : 'text-[#8892a4] hover:text-white'}`}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5c542] rounded-full" />}
            </button>
          ))}
          <button onClick={close} className="ml-auto mr-2 mb-1 w-7 h-7 flex items-center justify-center rounded-lg text-[#8892a4] hover:text-white hover:bg-[#232b3e] transition-colors text-lg">×</button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Amount selector */}
          {tab === 'deposit' ? (
            <>
              <p className="text-[#8892a4] text-xs">Select or enter amount to deposit:</p>
              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom('') }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${amount === a ? 'bg-[#f5c542] text-[#0b0e14] border-[#f5c542]' : 'bg-[#131720] text-[#c8d0e0] border-[#232b3e] hover:border-[#f5c542]/40'}`}
                  >
                    {a >= 1000 ? `${a/1000}k` : a} DC
                  </button>
                ))}
              </div>
              <input type="number" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null) }}
                placeholder="Custom amount..." className="w-full bg-[#131720] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-2.5 text-white placeholder-[#8892a4] focus:outline-none text-sm" />
              {finalAmount && finalAmount > 0 && (
                <div className="bg-[#131720] border border-[#f5c542]/20 rounded-xl p-4">
                  <p className="text-[#8892a4] text-xs mb-2"><span className="text-[#f5c542]">①</span> Run in Donut SMP chat:</p>
                  <div className="bg-[#0b0e14] rounded-lg px-4 py-2.5 font-mono text-[#f5c542] text-sm select-all cursor-copy border border-[#232b3e]">/pay taurasone {finalAmount}</div>
                  <p className="text-[#8892a4] text-xs mt-2"><span className="text-[#f5c542]">②</span> Then click below</p>
                </div>
              )}
              <button onClick={submitDeposit} disabled={!finalAmount || finalAmount < 1 || loading}
                className="w-full bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm">
                {loading ? 'Submitting...' : "I've sent the payment →"}
              </button>
            </>
          ) : (
            <>
              <p className="text-[#8892a4] text-xs">Available: <span className="text-[#f5c542] font-semibold">{balance.toLocaleString()} DC</span></p>
              <p className="text-[#8892a4] text-xs bg-[#131720] border border-[#232b3e] rounded-lg p-3">
                ⚠️ Your balance is deducted immediately when you submit a withdrawal request.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.filter(a => a <= balance).map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom('') }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${amount === a ? 'bg-[#f5c542] text-[#0b0e14] border-[#f5c542]' : 'bg-[#131720] text-[#c8d0e0] border-[#232b3e] hover:border-[#f5c542]/40'}`}
                  >
                    {a >= 1000 ? `${a/1000}k` : a} DC
                  </button>
                ))}
              </div>
              <input type="number" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null) }}
                placeholder="Custom amount..." max={balance} className="w-full bg-[#131720] border border-[#232b3e] focus:border-[#f5c542]/50 rounded-xl px-4 py-2.5 text-white placeholder-[#8892a4] focus:outline-none text-sm" />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={submitWithdraw} disabled={!finalAmount || finalAmount < 1 || loading}
                className="w-full bg-[#f5c542] hover:bg-[#e6b800] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm">
                {loading ? 'Submitting...' : 'Request Withdrawal →'}
              </button>
            </>
          )}

          {/* Transaction history */}
          {txList.length > 0 && (
            <div>
              <p className="text-[#8892a4] text-xs font-semibold uppercase tracking-wider mb-2">Recent {tab}s</p>
              <div className="space-y-2">
                {txList.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between bg-[#131720] border border-[#232b3e] rounded-xl px-4 py-2.5">
                    <div>
                      <span className="text-white font-semibold text-sm">{tx.amount.toLocaleString()} DC</span>
                      <p className="text-[#8892a4] text-[10px]">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    {statusBadge(tx.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
