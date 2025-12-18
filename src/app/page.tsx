'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import ThemeToggle from '@/components/ThemeToggle'

const CURRENCIES = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
]

export default function Home() {
  const router = useRouter()
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'create' | 'join' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [teamName, setTeamName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [organizerName, setOrganizerName] = useState('')
  const [budget, setBudget] = useState('')
  const [currency, setCurrency] = useState('MYR')

  const [organizerEmail, setOrganizerEmail] = useState('')
  const [organizerPassword, setOrganizerPassword] = useState('')

  const [joinToken, setJoinToken] = useState('')
  const [joinName, setJoinName] = useState('')
  const [joinEmail, setJoinEmail] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [createdTeamToken, setCreatedTeamToken] = useState<string | null>(null)
  const [tokenCopied, setTokenCopied] = useState(false)

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
          email: organizerEmail,
          password: organizerPassword,
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
      setCreatedTeamToken(data.team.token)
      setToast({ message: 'Team created successfully! 🎄', type: 'success' })
      // Delay redirect to allow user to copy token
      setTimeout(() => {
        router.push(`/team/${data.team.token}`)
      }, 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const copyToken = async () => {
    if (createdTeamToken) {
      try {
        await navigator.clipboard.writeText(createdTeamToken)
        setTokenCopied(true)
        setToast({ message: 'Token copied to clipboard! 📋', type: 'success' })
        setTimeout(() => setTokenCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        setToast({ message: 'Failed to copy token', type: 'error' })
      }
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
          email: joinEmail,
          password: joinPassword,
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
      
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between">
        {/* MonstarX Logo */}
        <div className="opacity-70 hover:opacity-100 transition-opacity duration-300">
          <img
            src="/monstarx-logo.svg"
            alt="MonstarX"
            className="h-10 md:h-12 w-auto"
          />
        </div>
        
        {/* Right Side: Login + Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[#C8102E] dark:text-[#FFD700] font-semibold rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border-2 border-[#C8102E] dark:border-[#FFD700] flex items-center gap-2"
          >
            <span>🔐</span>
            <span>Login</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Elegant Christmas Background Images */}
      {/* Top Left Decorative Blob */}
      <div className="fixed top-0 left-0 w-96 h-96 opacity-20 dark:opacity-10 pointer-events-none z-0">
        <img
          src="/unsplash_NFfBlixWJLk.svg"
          alt=""
          className="w-full h-full object-cover rounded-full blur-2xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* Right Side Decorative Element */}
      <div className="fixed top-20 right-0 w-[500px] h-[600px] opacity-15 dark:opacity-10 pointer-events-none z-0">
        <img
          src="/unsplash_bsSxXkBQTB4.png"
          alt=""
          className="w-full h-full object-cover rounded-l-[100px] blur-xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* Bottom Center Decorative Accent */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[700px] h-96 opacity-10 dark:opacity-5 pointer-events-none z-0">
        <img
          src="/unsplash_ocq7NBmpOYU.svg"
          alt=""
          className="w-full h-full object-cover rounded-t-[200px] blur-3xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-4xl md:text-5xl animate-bounce">🎄</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-christmas font-bold text-[#C8102E] dark:text-[#FFD700] drop-shadow-lg bg-gradient-to-r from-[#C8102E] via-[#8B0000] to-[#C8102E] dark:from-[#FFD700] dark:via-[#FFA500] dark:to-[#FFD700] bg-clip-text text-transparent animate-pulse-slow">
              Secret Santa
            </h1>
            <span className="text-4xl md:text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
          </div>
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="text-2xl md:text-3xl star-decoration">✨</span>
            <p className="text-xl md:text-2xl lg:text-3xl text-[#0F5132] dark:text-[#90EE90] font-semibold">
              Organize your gift exchange with ease
            </p>
            <span className="text-2xl md:text-3xl star-decoration" style={{ animationDelay: '1s' }}>✨</span>
          </div>
        </div>

        {activeTab === null ? (
          <div className="max-w-md mx-auto space-y-6">
            <button
              onClick={() => setActiveTab('create')}
              className="w-full py-8 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white font-bold text-2xl rounded-3xl shadow-2xl hover:from-[#8B0000] hover:to-[#C8102E] transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 border-white relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl group-hover:animate-bounce">✨</span>
                <span>Create Team</span>
                <span className="text-3xl group-hover:animate-bounce">🎄</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className="w-full py-8 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white font-bold text-2xl rounded-3xl shadow-2xl hover:from-[#0A3D2E] hover:to-[#0F5132] transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 border-white relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl group-hover:animate-bounce">🎁</span>
                <span>Join Team</span>
                <span className="text-3xl group-hover:animate-bounce">⭐</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => {
                setActiveTab(null)
                setError('')
                setTeamName('')
                setCompanyName('')
                setEventDate('')
                setOrganizerName('')
                setOrganizerEmail('')
                setOrganizerPassword('')
                setBudget('')
                setJoinToken('')
                setJoinName('')
                setJoinEmail('')
                setJoinPassword('')
              }}
              className="mb-4 px-4 py-2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-[#0F5132] dark:text-gray-200 font-semibold rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border-2 border-[#0F5132] dark:border-gray-500"
            >
              ← Back
            </button>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C8102E] dark:border-[#FFD700] relative z-10 transform hover:scale-105 transition-transform duration-300">
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

              <div className="p-8 bg-gradient-to-br from-white via-[#FFF8E7] to-[#E8F5E9] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 relative overflow-hidden">
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

            {createdTeamToken && (
              <div className="mb-4 p-4 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] border-2 border-[#0F5132] rounded-xl shadow-md relative z-10 animate-pulse-slow">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <span className="font-bold text-[#0F5132]">Team Created Successfully!</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border-2 border-[#C8102E]">
                    <p className="text-sm text-[#0A3D2E] mb-2 font-semibold">Your Team Token:</p>
                    <div 
                      onClick={copyToken}
                      className={`group relative px-4 py-3 rounded-lg font-mono font-bold text-lg transition-all cursor-pointer select-all ${
                        tokenCopied
                          ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                          : 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white hover:from-[#8B0000] hover:to-[#C8102E] hover:scale-105 active:scale-95'
                      } shadow-lg`}
                    >
                      {tokenCopied ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-xl">✓</span>
                          <span>Copied to clipboard!</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-xl group-hover:animate-bounce">📋</span>
                          <span className="tracking-wider">{createdTeamToken}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-center mt-2 text-xs text-[#0A3D2E] font-semibold">
                      {tokenCopied ? (
                        <span className="text-[#0F5132]">✓ Token copied! Share it with your team</span>
                      ) : (
                        <span>👆 Click anywhere on the token to copy</span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-[#0A3D2E] text-center">
                    Redirecting to team page in a few seconds... 🎄
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'create' ? (
              <form onSubmit={handleCreateTeam} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Team Name <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="Engineering Team"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Company Name <span className="text-gray-500 dark:text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="MonstarX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Event Date <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Budget <span className="text-gray-500 dark:text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 font-semibold text-[#0F5132] dark:text-gray-200"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0A3D2E] dark:text-gray-200 font-bold">
                        {CURRENCIES.find(c => c.code === currency)?.symbol}
                      </span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        min="0"
                        step="10"
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] transition-all bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder:text-gray-600 dark:placeholder:text-gray-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Your Name <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Email <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Password <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(min 6 characters)</span>
                  </label>
                  <input
                    type="password"
                    value={organizerPassword}
                    onChange={(e) => setOrganizerPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="••••••••"
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
              <form onSubmit={handleJoinTeam} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Team Token <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Enter the token from your organizer)</span>
                  </label>
                  <input
                    type="text"
                    value={joinToken}
                    onChange={(e) => setJoinToken(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    required
                    maxLength={10}
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0F5132] dark:focus:ring-[#90EE90] focus:border-[#0F5132] dark:focus:border-[#90EE90] transition-all bg-white dark:bg-gray-800 text-black dark:text-white uppercase tracking-widest text-center font-mono text-lg font-bold placeholder:text-gray-600 dark:placeholder:text-gray-400"
                    placeholder="ABCD1234XY"
                  />
                  {joinToken && (
                    <p className="text-xs text-[#0F5132] dark:text-gray-300 mt-1 text-center">
                      Token: <span className="font-mono font-bold">{joinToken}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Your Name <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0F5132] dark:focus:ring-[#90EE90] focus:border-[#0F5132] dark:focus:border-[#90EE90] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Email <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="email"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0F5132] dark:focus:ring-[#90EE90] focus:border-[#0F5132] dark:focus:border-[#90EE90] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Password <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(min 6 characters)</span>
                  </label>
                  <input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0F5132] dark:focus:ring-[#90EE90] focus:border-[#0F5132] dark:focus:border-[#90EE90] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="••••••••"
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
        )}
      </div>
    </div>
  )
}
