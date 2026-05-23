'use client'
import { useState, useEffect } from 'react'
import { formatBalance } from '@/lib/format'

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
    const res = await fetch('/api/deposit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId, amount: finalAmount }) })
    if (res.ok) { setSubmitted(true); setAmount(null); setCustom('') }
    setLoading(false)
  }

  async function submitWithdraw() {
    if (!finalAmount || finalAmount < 1) return
    if (finalAmount > balance) { setError('Insufficient balance'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId, amount: finalAmount }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setSubmitted(true); setAmount(null); setCustom('')
    setLoading(false)
  }

  function switchTab(t: 'deposit' | 'withdraw') {
    setTab(t); setSubmitted(false); setAmount(null); setCustom(''); setError('')
  }

  const statusBadge = (s: string) => {
    if (s === 'confirmed') return <span className="text-[11px] bg-[#3dd68c]/15 text-[#3dd68c] px-2.5 py-1 rounded-full font-semibold">Confirmed</span>
    if (s === 'rejected') return <span className="text-[11px] bg-red-500/15 text-red-400 px-2.5 py-1 rounded-full font-semibold">Rejected</span>
    return <span className="text-[11px] bg-[#f5c542]/15 text-[#f5c542] px-2.5 py-1 rounded-full font-semibold">Pending</span>
  }

  const txList = tab === 'deposit' ? deposits : withdrawals

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-[220ms] ${visible ? 'bg-black/75 backdrop-blur-sm' : 'bg-transparent'}`}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        className={`w-full max-w-[420px] bg-[#0f1923] border border-[#1e2d3d] rounded-2xl shadow-2xl overflow-hidden transition-all duration-[220ms] ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'}`}
      >
        {/* Tabs */}
        <div className="flex items-center bg-[#0b1219] border-b border-[#1e2d3d] px-1 pt-1">
          {(['deposit', 'withdraw'] as const).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`relative px-6 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-white' : 'text-[#4a6180] hover:text-[#8ba3bc]'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#3dd68c] rounded-full" />}
            </button>
          ))}
          <button onClick={close}
            className="ml-auto mr-2 mb-1 w-8 h-8 flex items-center justify-center rounded-lg text-[#4a6180] hover:text-white hover:bg-[#1e2d3d] transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          {tab === 'deposit' ? (
            <>
              <p className="text-[#4a6180] text-xs font-medium">Select or enter amount to deposit:</p>

              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom('') }}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${amount === a ? 'bg-[#3dd68c] text-[#0b0e14] border-[#3dd68c]' : 'bg-[#0b1219] text-[#c8d8e8] border-[#1e2d3d] hover:border-[#3dd68c]/30'}`}>
                    {a >= 1000 ? `${a / 1000}k` : a} DC
                  </button>
                ))}
              </div>

              <input type="number" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null) }}
                placeholder="Custom amount..."
                className="w-full bg-[#0b1219] border border-[#1e2d3d] focus:border-[#3dd68c]/50 rounded-xl px-4 py-3 text-white placeholder-[#4a6180] focus:outline-none text-sm transition-colors" />

              {finalAmount && finalAmount > 0 && (
                <div className="bg-[#0b1219] border border-[#1e2d3d] rounded-xl p-4 space-y-2">
                  <p className="text-[#4a6180] text-xs"><span className="text-[#3dd68c] font-bold">①</span> Run in Donut SMP chat:</p>
                  <div className="bg-[#060c12] border border-[#1e2d3d] rounded-lg px-4 py-3 font-mono text-[#3dd68c] text-sm select-all cursor-copy">
                    /pay taurasone {finalAmount}
                  </div>
                  <p className="text-[#4a6180] text-xs"><span className="text-[#3dd68c] font-bold">②</span> Then click the button below</p>
                </div>
              )}

              <button onClick={submitDeposit} disabled={!finalAmount || finalAmount < 1 || loading}
                className="w-full bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]">
                {loading ? 'Submitting...' : "I've sent the payment →"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[#4a6180] text-xs font-medium">Available balance</p>
                <p className="text-white font-bold text-sm">{formatBalance(balance)} DC</p>
              </div>

              <div className="bg-[#0b1219] border border-[#1e2d3d] rounded-xl px-4 py-3 text-[#4a6180] text-xs">
                ⚠️ Your balance is deducted immediately when you submit a withdrawal request.
              </div>

              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.filter(a => a <= balance).map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom('') }}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${amount === a ? 'bg-[#f5c542] text-[#0b0e14] border-[#f5c542]' : 'bg-[#0b1219] text-[#c8d8e8] border-[#1e2d3d] hover:border-[#f5c542]/30'}`}>
                    {a >= 1000 ? `${a / 1000}k` : a} DC
                  </button>
                ))}
              </div>

              <input type="number" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null) }}
                placeholder="Custom amount..." max={balance}
                className="w-full bg-[#0b1219] border border-[#1e2d3d] focus:border-[#f5c542]/50 rounded-xl px-4 py-3 text-white placeholder-[#4a6180] focus:outline-none text-sm transition-colors" />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={submitWithdraw} disabled={!finalAmount || finalAmount < 1 || loading}
                className="w-full bg-[#f5c542] hover:bg-[#e6b800] disabled:opacity-30 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]">
                {loading ? 'Submitting...' : 'Request Withdrawal →'}
              </button>
            </>
          )}

          {txList.length > 0 && (
            <div>
              <p className="text-[#4a6180] text-[11px] font-semibold uppercase tracking-widest mb-3">Recent {tab}s</p>
              <div className="space-y-2">
                {txList.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between bg-[#0b1219] border border-[#1e2d3d] rounded-xl px-4 py-3">
                    <div>
                      <span className="text-white font-semibold text-sm">{formatBalance(tx.amount)} DC</span>
                      <p className="text-[#4a6180] text-[11px] mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
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
