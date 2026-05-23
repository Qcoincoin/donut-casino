'use client'
import { useState, useEffect } from 'react'

type Step = 'username' | 'new-pin' | 'existing-pin'

interface Player { id: string; username: string; balance: number }
interface Props { onLogin: (player: Player) => void; onClose: () => void }

export default function LoginModal({ onLogin, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<Step>('username')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  function close() { setVisible(false); setTimeout(onClose, 220) }

  async function checkUsername() {
    if (!username.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username.trim() }) })
      const data = await res.json()
      setStep(data.exists ? 'existing-pin' : 'new-pin')
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  async function handleLogin() {
    if (pin.length !== 4) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username.trim(), pin }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onLogin(data.player); close()
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  async function handleRegister() {
    if (pin.length !== 4 || pin !== confirmPin) { setError('PINs do not match'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username.trim(), pin }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onLogin(data.player); close()
    } catch { setError('Network error') } finally { setLoading(false) }
  }

  const PinDots = ({ value }: { value: string }) => (
    <div className="flex gap-3 justify-center my-5">
      {[0,1,2,3].map(i => (
        <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${value[i] ? 'bg-[#3dd68c]/20 border-2 border-[#3dd68c] text-[#3dd68c]' : 'bg-[#0b1219] border-2 border-[#1e2d3d]'}`}>
          {value[i] ? '●' : ''}
        </div>
      ))}
    </div>
  )

  const NumPad = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
      {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
        <button key={i} disabled={k === ''} onClick={() => { if (k === '⌫') onChange(value.slice(0,-1)); else if (k && value.length < 4) onChange(value + k) }}
          className={`h-11 rounded-xl text-base font-semibold transition-all ${k === '' ? 'invisible' : k === '⌫' ? 'bg-[#1e2d3d] hover:bg-[#263848] text-[#8ba3bc]' : 'bg-[#0b1219] hover:bg-[#1a2d1f] text-white border border-[#1e2d3d] hover:border-[#3dd68c]/40'}`}>
          {k}
        </button>
      ))}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: visible ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)', transition: 'background 0.22s', backdropFilter: visible ? 'blur(4px)' : 'none' }}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        className="w-full sm:max-w-sm bg-[#0f1923] border border-[#1e2d3d] sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
        style={{ transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)', opacity: visible ? 1 : 0, transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍩</span>
            <span className="font-bold text-white">Donut Casino</span>
          </div>
          <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4a6180] hover:text-white hover:bg-[#1e2d3d] transition-colors text-xl">×</button>
        </div>

        <div className="p-5">
          {step === 'username' && (
            <div className="space-y-4">
              <div>
                <p className="text-[#4a6180] text-xs font-medium mb-1.5">Minecraft Username</p>
                <input
                  type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkUsername()}
                  placeholder="Enter your username"
                  className="w-full bg-[#0b1219] border border-[#1e2d3d] focus:border-[#3dd68c]/50 rounded-xl px-4 py-3 text-white placeholder-[#4a6180] focus:outline-none text-sm transition-colors"
                />
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>
              <button onClick={checkUsername} disabled={loading || !username.trim()}
                className="w-full bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0b0e14] font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]">
                {loading ? 'Checking...' : 'Continue →'}
              </button>
            </div>
          )}

          {step === 'existing-pin' && (
            <div>
              <p className="text-center text-white font-semibold">Welcome back, <span className="text-[#3dd68c]">{username}</span></p>
              <p className="text-center text-[#4a6180] text-sm mt-1 mb-1">Enter your 4-digit PIN</p>
              <PinDots value={pin} />
              <NumPad value={pin} onChange={v => { setPin(v); if (v.length === 4) setTimeout(handleLogin, 120) }} />
              {error && <p className="text-red-400 text-xs text-center mt-3">{error}</p>}
              <button onClick={() => { setStep('username'); setPin(''); setError('') }} className="w-full mt-4 text-[#4a6180] text-xs hover:text-white transition-colors">← Back</button>
            </div>
          )}

          {step === 'new-pin' && (
            <div>
              <p className="text-center text-white font-semibold">Create account: <span className="text-[#3dd68c]">{username}</span></p>
              {pin.length < 4
                ? <><p className="text-center text-[#4a6180] text-sm mt-1 mb-1">Set a 4-digit PIN</p><PinDots value={pin} /><NumPad value={pin} onChange={setPin} /></>
                : <><p className="text-center text-[#4a6180] text-sm mt-1 mb-1">Confirm your PIN</p><PinDots value={confirmPin} /><NumPad value={confirmPin} onChange={v => { setConfirmPin(v); if (v.length === 4) setTimeout(handleRegister, 120) }} /></>
              }
              {error && <p className="text-red-400 text-xs text-center mt-3">{error}</p>}
              {pin.length === 4 && confirmPin.length === 4 && (
                <button onClick={handleRegister} disabled={loading}
                  className="w-full mt-4 bg-[#3dd68c] hover:bg-[#2fc47a] disabled:opacity-40 text-[#0b0e14] font-bold py-3 rounded-xl text-sm transition-all">
                  {loading ? 'Creating...' : 'Create Account →'}
                </button>
              )}
              <button onClick={() => { setStep('username'); setPin(''); setConfirmPin(''); setError('') }} className="w-full mt-3 text-[#4a6180] text-xs hover:text-white transition-colors">← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
