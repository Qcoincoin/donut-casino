'use client'
import { useState } from 'react'

type Step = 'username' | 'new-pin' | 'existing-pin'

interface Player {
  id: string
  username: string
  balance: number
}

interface Props {
  onLogin: (player: Player) => void
}

export default function LoginModal({ onLogin }: Props) {
  const [step, setStep] = useState<Step>('username')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function checkUsername() {
    if (!username.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      })
      const data = await res.json()
      if (data.exists) {
        setIsNew(false)
        setStep('existing-pin')
      } else {
        setIsNew(true)
        setStep('new-pin')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    if (pin.length !== 4) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), pin })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onLogin(data.player)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (pin.length !== 4 || pin !== confirmPin) {
      setError('PINs do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), pin })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onLogin(data.player)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function PinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
      <div className="flex gap-3 justify-center my-4">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl border-2 border-yellow-500/50 bg-gray-800 flex items-center justify-center text-2xl font-bold text-yellow-400"
          >
            {value[i] ? '●' : ''}
          </div>
        ))}
      </div>
    )
  }

  function NumPad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']
    return (
      <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
        {keys.map((k, i) => (
          <button
            key={i}
            disabled={k === ''}
            onClick={() => {
              if (k === '⌫') onChange(value.slice(0, -1))
              else if (k && value.length < 4) onChange(value + k)
            }}
            className={`h-12 rounded-xl text-lg font-semibold transition-colors ${
              k === '' ? 'invisible' :
              k === '⌫' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' :
              'bg-gray-700 hover:bg-yellow-500/20 text-white border border-gray-600 hover:border-yellow-500/50'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🍩</div>
          <h1 className="text-2xl font-bold text-yellow-400">Donut Casino</h1>
          <p className="text-gray-400 text-sm mt-1">Donut SMP's official casino</p>
        </div>

        {step === 'username' && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Minecraft Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkUsername()}
              placeholder="Enter your username"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              onClick={checkUsername}
              disabled={loading || !username.trim()}
              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </div>
        )}

        {step === 'existing-pin' && (
          <div>
            <p className="text-center text-gray-300 mb-1">Welcome back, <span className="text-yellow-400 font-semibold">{username}</span></p>
            <p className="text-center text-gray-400 text-sm mb-2">Enter your 4-digit PIN</p>
            <PinInput value={pin} onChange={setPin} />
            <NumPad value={pin} onChange={setPin} />
            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading || pin.length !== 4}
              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button onClick={() => { setStep('username'); setPin(''); setError('') }} className="w-full mt-2 text-gray-500 text-sm hover:text-gray-300">
              ← Back
            </button>
          </div>
        )}

        {step === 'new-pin' && (
          <div>
            <p className="text-center text-gray-300 mb-1">New account: <span className="text-yellow-400 font-semibold">{username}</span></p>
            {!confirmPin && pin.length < 4 ? (
              <p className="text-center text-gray-400 text-sm mb-2">Set a 4-digit PIN</p>
            ) : pin.length === 4 ? (
              <p className="text-center text-gray-400 text-sm mb-2">Confirm your PIN</p>
            ) : null}

            {pin.length < 4 ? (
              <>
                <PinInput value={pin} onChange={setPin} />
                <NumPad value={pin} onChange={setPin} />
              </>
            ) : (
              <>
                <PinInput value={confirmPin} onChange={setConfirmPin} />
                <NumPad value={confirmPin} onChange={setConfirmPin} />
              </>
            )}

            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}

            {pin.length === 4 && confirmPin.length === 4 && (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            )}
            <button onClick={() => { setStep('username'); setPin(''); setConfirmPin(''); setError('') }} className="w-full mt-2 text-gray-500 text-sm hover:text-gray-300">
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
