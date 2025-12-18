'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [identifier, setIdentifier] = useState('') // Username or email
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier, // Can be username (displayName) or email
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      localStorage.setItem('participantId', data.participant.id)
      localStorage.setItem('teamToken', data.team.token)
      setToast({ message: 'Welcome back! 🎄', type: 'success' })
      
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
            className="h-10 md:h-12 w-auto cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        
        <ThemeToggle />
      </div>

      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-96 h-96 opacity-20 dark:opacity-10 pointer-events-none z-0">
        <img
          src="/unsplash_NFfBlixWJLk.svg"
          alt=""
          className="w-full h-full object-cover rounded-full blur-2xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <div className="fixed top-20 right-0 w-[500px] h-[600px] opacity-15 dark:opacity-10 pointer-events-none z-0">
        <img
          src="/unsplash_bsSxXkBQTB4.png"
          alt=""
          className="w-full h-full object-cover rounded-l-[100px] blur-xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-4xl md:text-5xl animate-bounce">🔐</span>
            <h1 className="text-5xl md:text-6xl font-christmas font-bold text-[#C8102E] dark:text-[#FFD700] drop-shadow-lg">
              Welcome Back
            </h1>
            <span className="text-4xl md:text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎄</span>
          </div>
          <p className="text-xl text-[#0F5132] dark:text-[#90EE90] font-semibold">
            Login to access your team
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C8102E] dark:border-[#FFD700] relative z-10">
            <div className="bg-gradient-to-r from-[#C8102E] to-[#8B0000] dark:from-[#FFD700] dark:to-[#FFA500] py-4 px-6">
              <h2 className="text-xl font-bold text-white dark:text-gray-900 text-center flex items-center justify-center gap-2">
                <span>🎁</span>
                <span>Sign In</span>
                <span>🎁</span>
              </h2>
            </div>

            <div className="p-8 bg-gradient-to-br from-white via-[#FFF8E7] to-[#E8F5E9] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-[#C8102E] text-[#8B0000] dark:text-red-300 rounded-xl shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Username or Email <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                    placeholder="Enter your username or email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F5132] dark:text-gray-200 mb-2">
                    Password <span className="text-[#C8102E] dark:text-[#FFD700]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#C8102E] dark:focus:ring-[#FFD700] focus:border-[#C8102E] dark:focus:border-[#FFD700] transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <span className="text-xl">👁️</span>
                      ) : (
                        <span className="text-xl">👁️‍🗨️</span>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white font-bold rounded-xl hover:from-[#8B0000] hover:to-[#C8102E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🎄</span>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>🔓</span>
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => router.push('/')}
                    className="text-[#C8102E] dark:text-[#FFD700] font-semibold hover:underline"
                  >
                    Create or Join a Team
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

