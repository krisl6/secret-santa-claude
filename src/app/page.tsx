'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import ChristmasTree from '@/components/ChristmasTree'

const CURRENCIES = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
]

export default function Home() {
  const router = useRouter()
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [teamName, setTeamName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [organizerName, setOrganizerName] = useState('')
  const [budget, setBudget] = useState('')
  const [currency, setCurrency] = useState('MYR')

  const [joinToken, setJoinToken] = useState('')
  const [joinName, setJoinName] = useState('')

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          companyName: companyName || undefined,
          eventDate,
          organizerName,
          budget: budget || undefined,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team')
      }

      localStorage.setItem('participantId', data.participant.id)
      localStorage.setItem('teamToken', data.team.token)
      setToast({ message: 'Team created successfully! 🎄', type: 'success' })
      setTimeout(() => {
        router.push(`/team/${data.team.token}`)
      }, 500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: joinToken.toUpperCase(),
          displayName: joinName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join team')
      }

      localStorage.setItem('participantId', data.participant.id)
      localStorage.setItem('teamToken', data.team.token)
      setToast({ message: 'Joined team successfully! 🎁', type: 'success' })
      setTimeout(() => {
        router.push(`/team/${data.team.token}`)
      }, 500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative z-10 overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Animated Christmas Trees */}
      <ChristmasTree size="medium" position="left" delay={200} />
      <ChristmasTree size="medium" position="right" delay={400} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-4xl md:text-5xl animate-bounce">🎄</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-christmas font-bold text-[#C8102E] drop-shadow-lg bg-gradient-to-r from-[#C8102E] via-[#8B0000] to-[#C8102E] bg-clip-text text-transparent animate-pulse-slow">
              Secret Santa
            </h1>
            <span className="text-4xl md:text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
          </div>
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="text-2xl md:text-3xl star-decoration">✨</span>
            <p className="text-xl md:text-2xl lg:text-3xl text-[#0F5132] font-semibold">
              Organize your gift exchange with ease
            </p>
            <span className="text-2xl md:text-3xl star-decoration" style={{ animationDelay: '1s' }}>✨</span>
          </div>
          <div className="flex justify-center gap-4 text-2xl md:text-3xl mb-4">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎅</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎄</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>❄️</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</span>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C8102E] relative z-10 transform hover:scale-105 transition-transform duration-300">
          <div className="flex relative">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                activeTab === 'create'
                  ? 'bg-[#C8102E] text-white shadow-lg transform scale-105'
                  : 'bg-[#FFE5E5] text-[#8B0000] hover:bg-[#FFD0D0]'
              }`}
            >
              {activeTab === 'create' && (
                <span className="absolute top-1 right-2 text-lg animate-bounce">✨</span>
              )}
              Create Team
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                activeTab === 'join'
                  ? 'bg-[#0F5132] text-white shadow-lg transform scale-105'
                  : 'bg-[#E8F5E9] text-[#0A3D2E] hover:bg-[#C8E6C9]'
              }`}
            >
              {activeTab === 'join' && (
                <span className="absolute top-1 right-2 text-lg animate-bounce">🎁</span>
              )}
              Join Team
            </button>
          </div>

          <div className="p-8 bg-gradient-to-br from-white via-[#FFF8E7] to-[#E8F5E9] relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 text-2xl opacity-20 animate-twinkle">✨</div>
            <div className="absolute top-2 right-2 text-2xl opacity-20 animate-twinkle" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute bottom-2 left-2 text-2xl opacity-20 animate-twinkle" style={{ animationDelay: '1s' }}>🎄</div>
            <div className="absolute bottom-2 right-2 text-2xl opacity-20 animate-twinkle" style={{ animationDelay: '1.5s' }}>🎁</div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-[#C8102E] text-[#8B0000] rounded-xl shadow-md relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {activeTab === 'create' ? (
              <form onSubmit={handleCreateTeam} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Team Name <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white"
                    placeholder="Engineering Team"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Company Name <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Event Date <span className="text-[#C8102E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => dateInputRef.current?.showPicker()}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      📅
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Budget <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white font-semibold text-[#0F5132]"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0F5132] font-bold">
                        {CURRENCIES.find(c => c.code === currency)?.symbol}
                      </span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        min="0"
                        step="10"
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Your Name <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white"
                    placeholder="John Doe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white font-bold rounded-xl hover:from-[#8B0000] hover:to-[#C8102E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🎄</span>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>✨</span>
                      Create Team
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoinTeam} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Team Token <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={joinToken}
                    onChange={(e) => setJoinToken(e.target.value.toUpperCase())}
                    required
                    maxLength={10}
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all bg-white uppercase tracking-widest text-center font-mono text-lg font-bold"
                    placeholder="ABCD1234XY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                    Your Name <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all bg-white"
                    placeholder="Jane Doe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white font-bold rounded-xl hover:from-[#0A3D2E] hover:to-[#0F5132] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🎄</span>
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>🎁</span>
                      Join Team
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
