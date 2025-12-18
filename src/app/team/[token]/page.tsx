'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CountdownTimer from '@/components/CountdownTimer'
import ShareTeam from '@/components/ShareTeam'
import Exclusions from '@/components/Exclusions'
import GiftTracking from '@/components/GiftTracking'
import Toast from '@/components/Toast'
import ThemeToggle from '@/components/ThemeToggle'

interface WishlistItem {
  id: string
  itemName: string
  description: string | null
  link: string | null
  priceRange: string | null
}

interface Participant {
  id: string
  displayName: string
  isOrganizer: boolean
  wishlistItemCount?: number
}

interface Assignment {
  giver: string
  receiver: string
}

interface ReceiverInfo {
  id: string
  displayName: string
  wishlistItems: WishlistItem[]
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  MYR: 'RM',
  SGD: 'S$',
  JPY: '¥',
}

interface TeamData {
  team: {
    id: string
    name: string
    companyName: string | null
    eventDate: string
    token: string
    budget: number | null
    currency: string
    isLocked: boolean
    drawComplete: boolean
    participantCount: number
  }
  participant?: {
    id: string
    displayName: string
    isOrganizer: boolean
    wishlistItems: WishlistItem[]
  }
  participants?: Participant[]
  assignments?: Assignment[]
  assignment?: {
    id: string
    receiver: ReceiverInfo
    isPurchased?: boolean
    isReceived?: boolean
    photoUrl?: string | null
    thankYouMessage?: string | null
  }
}

export default function TeamPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    link: '',
    priceRange: '',
  })
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [copied, setCopied] = useState<'link' | 'token' | null>(null)

  const getShareLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/team/${token}`
    }
    return ''
  }

  const copyToClipboard = async (text: string, type: 'link' | 'token') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const participantId = localStorage.getItem('participantId')
      const response = await fetch(
        `/api/teams?token=${token}&participantId=${participantId || ''}`
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch team data')
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddWishlistItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data?.participant) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: data.participant.id,
          itemName: newItem.itemName,
          description: newItem.description || undefined,
          link: newItem.link || undefined,
          priceRange: newItem.priceRange || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add item')
      }

      setNewItem({ itemName: '', description: '', link: '', priceRange: '' })
      setToast({ message: 'Wishlist item added! 🎁', type: 'success' })
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateWishlistItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data?.participant || !editingItem) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlistItemId: editingItem.id,
          participantId: data.participant.id,
          itemName: editingItem.itemName,
          description: editingItem.description || null,
          link: editingItem.link || null,
          priceRange: editingItem.priceRange || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update item')
      }

      setEditingItem(null)
      setToast({ message: 'Wishlist item updated! ✨', type: 'success' })
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteWishlistItem = async (itemId: string) => {
    if (!data?.participant) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlistItemId: itemId,
          participantId: data.participant.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete item')
      }

      setToast({ message: 'Wishlist item deleted! 🗑️', type: 'success' })
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleLockTeam = async (lock: boolean) => {
    if (!data?.participant) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/teams/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          participantId: data.participant.id,
          lock,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to lock/unlock team')
      }

      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveParticipant = async (participantIdToRemove: string) => {
    if (!data?.participant) return

    if (!confirm('Are you sure you want to remove this participant?')) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/participants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          organizerId: data.participant.id,
          participantIdToRemove,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove participant')
      }

      setToast({ message: team.isLocked ? 'Team unlocked! 🔓' : 'Team locked! 🔒', type: 'success' })
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDraw = async () => {
    if (!data?.participant) return

    if (!confirm('Are you sure you want to run the Secret Santa draw? This will lock the team.')) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          organizerId: data.participant.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run draw')
      }

      setToast({ message: 'Secret Santa draw completed! 🎄🎁', type: 'success' })
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('participantId')
    localStorage.removeItem('teamToken')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎄</div>
          <div className="text-2xl font-christmas text-[#C8102E]">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md text-center border-4 border-[#C8102E]">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-3xl font-christmas font-bold text-[#C8102E] mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Team not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white font-bold rounded-xl hover:from-[#8B0000] hover:to-[#C8102E] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const { team, participant, participants, assignments, assignment } = data
  const isOrganizer = participant?.isOrganizer ?? false
  const eventDate = new Date(team.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen relative z-10">
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
        <div className="opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => router.push('/')}>
          <img
            src="/monstarx-logo.svg"
            alt="MonstarX"
            className="h-5 md:h-6 w-auto"
          />
        </div>
        
        {/* Right Side: Logout + Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem('participantId')
              localStorage.removeItem('teamToken')
              router.push('/')
            }}
            className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[#8B0000] dark:text-[#FFD700] font-semibold rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border-2 border-[#8B0000] dark:border-[#FFD700] flex items-center gap-2 text-sm"
          >
            <span>👋</span>
            <span>Logout</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Logo/Home Link */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 block w-full text-center hover:opacity-80 transition-opacity"
        >
          <h1 className="text-5xl md:text-6xl font-christmas font-bold text-[#C8102E] mb-2 drop-shadow-lg hover:scale-105 transition-transform inline-block">
            Secret Santa
          </h1>
          <div className="flex justify-center items-center gap-2">
            <span className="text-2xl">🎄</span>
            <span className="text-sm md:text-base text-[#0F5132] font-semibold">Click to go home</span>
            <span className="text-2xl">🎁</span>
          </div>
        </button>

        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border-4 border-[#C8102E]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-christmas font-bold text-[#C8102E] mb-2">
                {team.name}
              </h1>
              {team.companyName && (
                <p className="text-lg text-[#0F5132] font-semibold">{team.companyName}</p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 space-y-1 sm:space-y-0">
                <p className="text-[#0A3D2E] flex items-center gap-2 text-sm sm:text-base">
                  <span>📅</span>
                  <span className="font-medium">Event Date: {eventDate}</span>
                </p>
                {team.budget && (
                  <p className="text-[#0A3D2E] dark:text-gray-200 flex items-center gap-2 flex-shrink-0">
                    <span>💰</span>
                    <span className="font-bold text-sm sm:text-lg text-[#0A3D2E] dark:text-white whitespace-nowrap">Budget: {CURRENCY_SYMBOLS[team.currency] || team.currency}{team.currency === 'JPY' ? team.budget.toFixed(0) : team.budget.toFixed(2)}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] px-4 py-2 rounded-xl border-2 border-[#0F5132]">
                <span className="text-sm text-[#0A3D2E] font-semibold">Token: </span>
                <span className="font-mono font-bold text-[#C8102E] text-lg">{team.token}</span>
              </div>
              {participant && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[#0F5132] hover:text-white hover:bg-[#C8102E] rounded-xl transition-all duration-300 font-semibold border-2 border-[#0F5132] hover:border-[#C8102E]"
                >
                  Leave
                </button>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {team.isLocked && (
              <span className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#8B0000] rounded-full text-sm font-bold shadow-md">
                🔒 Team Locked
              </span>
            )}
            {team.drawComplete && (
              <span className="px-4 py-2 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white rounded-full text-sm font-bold shadow-md">
                ✅ Draw Complete
              </span>
            )}
            <span className="px-4 py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-full text-sm font-bold shadow-md">
              👥 {team.participantCount} Participants
            </span>
          </div>
        </div>

        {/* Countdown Timer and Share */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CountdownTimer eventDate={team.eventDate} />
          <ShareTeam token={team.token} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-[#C8102E] text-[#8B0000] rounded-xl shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Wishlist */}
          {participant && (
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-[#0F5132] dark:border-[#90EE90]">
              <h2 className="text-3xl font-christmas font-bold text-[#0F5132] dark:text-[#90EE90] mb-4 flex items-center gap-2">
                <span>🎁</span>
                Your Wishlist
              </h2>
              <p className="text-[#0A3D2E] dark:text-gray-200 mb-4 font-medium">
                Add 1-3 items you&apos;d like to receive. Your Secret Santa will see these!
              </p>

              {/* Existing items */}
              <div className="space-y-3 mb-6">
                {participant.wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl p-4 bg-gradient-to-br from-white to-[#FFF8E7] dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all"
                  >
                    {editingItem?.id === item.id ? (
                      <form onSubmit={handleUpdateWishlistItem} className="space-y-3">
                        <input
                          type="text"
                          value={editingItem.itemName}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, itemName: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                        />
                        <input
                          type="text"
                          value={editingItem.description || ''}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, description: e.target.value })
                          }
                          placeholder="Description"
                          className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                        />
                        <input
                          type="url"
                          value={editingItem.link || ''}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, link: e.target.value })
                          }
                          placeholder="Link (optional)"
                          className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                        />
                        <input
                          type="text"
                          value={editingItem.priceRange || ''}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, priceRange: e.target.value })
                          }
                          placeholder="Price range (e.g., $20-30)"
                          className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="px-4 py-2 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white rounded-lg hover:from-[#0A3D2E] hover:to-[#0F5132] transition-all disabled:opacity-50 font-semibold shadow-md"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-[#0F5132] dark:text-[#90EE90] text-lg">
                              {item.itemName}
                            </h3>
                            {item.description && (
                              <p className="text-[#0A3D2E] dark:text-gray-200 text-sm mt-1">
                                {item.description}
                              </p>
                            )}
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C8102E] dark:text-[#FFD700] hover:text-[#8B0000] dark:hover:text-[#FFA500] hover:underline text-sm mt-1 inline-block font-semibold"
                              >
                                🔗 View Link
                              </a>
                            )}
                            {item.priceRange && (
                              <p className="text-[#0F5132] dark:text-[#90EE90] text-sm mt-1 font-semibold">
                                💰 {item.priceRange}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="text-[#0F5132] hover:text-white hover:bg-[#0F5132] px-3 py-1 rounded-lg transition-all font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteWishlistItem(item.id)}
                              className="text-[#C8102E] hover:text-white hover:bg-[#C8102E] px-3 py-1 rounded-lg transition-all font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add new item form */}
              {participant.wishlistItems.length < 3 && (
                <form onSubmit={handleAddWishlistItem} className="space-y-3 border-t-2 border-[#E8F5E9] dark:border-gray-600 pt-4">
                  <h3 className="font-bold text-[#0F5132] dark:text-[#90EE90] text-xl">Add Item</h3>
                  <input
                    type="text"
                    value={newItem.itemName}
                    onChange={(e) =>
                      setNewItem({ ...newItem, itemName: e.target.value })
                    }
                    required
                    placeholder="Item name *"
                    className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                  />
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    placeholder="Description (optional)"
                    className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                  />
                  <input
                    type="url"
                    value={newItem.link}
                    onChange={(e) =>
                      setNewItem({ ...newItem, link: e.target.value })
                    }
                    placeholder="Link (optional)"
                    className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                  />
                  <input
                    type="text"
                    value={newItem.priceRange}
                    onChange={(e) =>
                      setNewItem({ ...newItem, priceRange: e.target.value })
                    }
                    placeholder="Price range (e.g., $20-30)"
                    className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !newItem.itemName}
                    className="w-full py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-lg hover:from-[#8B0000] hover:to-[#C8102E] transition-all disabled:opacity-50 font-bold shadow-md"
                  >
                    ✨ Add to Wishlist
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Exclusions Section */}
          {participant && !team.drawComplete && (
            <div className="lg:col-span-2">
              <Exclusions
                token={team.token}
                participantId={participant.id}
                participants={participants?.map((p) => ({ id: p.id, displayName: p.displayName })) || []}
                isOrganizer={isOrganizer}
              />
            </div>
          )}

          {/* Right Column - Assignment or Organizer Controls */}
          <div className="space-y-6">
            {/* Your Assignment (after draw) */}
            {assignment && (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-[#FFD700]">
                <h2 className="text-3xl font-christmas font-bold text-[#C8102E] mb-4 flex items-center gap-2">
                  <span>🎅</span>
                  Your Secret Santa Assignment
                </h2>
                <div className="bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] dark:from-gray-700 dark:to-gray-800 border-4 border-[#0F5132] dark:border-[#90EE90] rounded-xl p-6 mb-6">
                  <p className="text-[#0A3D2E] dark:text-gray-200 mb-2 font-semibold text-lg">You are gifting:</p>
                  <p className="text-4xl font-christmas font-bold text-[#0F5132] dark:text-[#90EE90]">
                    {assignment.receiver.displayName}
                  </p>
                </div>

                <h3 className="font-bold text-[#0F5132] dark:text-[#90EE90] mt-6 mb-3 text-xl">
                  Their Wishlist:
                </h3>
                <div className="space-y-3">
                  {assignment.receiver.wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-[#E8F5E9] dark:border-gray-600 rounded-xl p-4 bg-gradient-to-br from-white to-[#FFF8E7] dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all"
                    >
                      <h4 className="font-bold text-[#0F5132] dark:text-[#90EE90] text-lg">
                        {item.itemName}
                      </h4>
                      {item.description && (
                        <p className="text-[#0A3D2E] dark:text-gray-200 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C8102E] dark:text-[#FFD700] hover:text-[#8B0000] dark:hover:text-[#FFA500] hover:underline text-sm mt-1 inline-block font-semibold"
                        >
                          🔗 View Link
                        </a>
                      )}
                      {item.priceRange && (
                        <p className="text-[#0F5132] dark:text-[#90EE90] text-sm mt-1 font-semibold">
                          💰 {item.priceRange}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gift Tracking */}
                {assignment && participant && (
                  <div className="mt-6">
                    <GiftTracking
                      assignmentId={assignment.id}
                      token={team.token}
                      participantId={participant.id}
                      receiverName={assignment.receiver.displayName}
                      initialIsPurchased={assignment.isPurchased || false}
                      initialIsReceived={assignment.isReceived || false}
                      initialPhotoUrl={assignment.photoUrl || null}
                      initialThankYouMessage={assignment.thankYouMessage || null}
                      isReceiver={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Organizer Controls */}
            {isOrganizer && (
              <>
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-[#C8102E]">
                  <h2 className="text-3xl font-christmas font-bold text-[#C8102E] mb-4 flex items-center gap-2">
                    <span>👑</span>
                    Organizer Dashboard
                  </h2>

                  {/* Participant List */}
                  <h3 className="font-bold text-[#0F5132] mb-3 text-xl">
                    Participants ({participants?.length || 0})
                  </h3>
                  <div className="space-y-2 mb-6">
                    {participants?.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border-2 border-[#E8F5E9] rounded-xl p-3 bg-gradient-to-br from-white to-[#FFF8E7] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#0F5132]">{p.displayName}</span>
                          {p.isOrganizer && (
                            <span className="px-3 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#8B0000] rounded-full text-xs font-bold shadow-sm">
                              👑 Organizer
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              (p.wishlistItemCount ?? 0) > 0
                                ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                                : 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white'
                            }`}
                          >
                            {p.wishlistItemCount ?? 0} items
                          </span>
                        </div>
                        {!p.isOrganizer && !team.drawComplete && (
                          <button
                            onClick={() => handleRemoveParticipant(p.id)}
                            disabled={actionLoading}
                            className="text-[#C8102E] hover:text-white hover:bg-[#C8102E] px-3 py-1 rounded-lg transition-all font-semibold text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Share with Teammates */}
                  {!team.drawComplete && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#FFF8E7] to-[#E8F5E9] rounded-xl border-2 border-[#FFD700]">
                      <h3 className="font-bold text-[#0F5132] mb-3 text-lg flex items-center gap-2">
                        <span>📤</span>
                        Share with Teammates
                      </h3>
                      <p className="text-sm text-[#0A3D2E] mb-3">
                        Send this link to your teammates so they can join:
                      </p>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={getShareLink()}
                            className="flex-1 px-3 py-2 bg-white border-2 border-[#E8F5E9] rounded-lg text-sm font-mono text-[#0A3D2E]"
                          />
                          <button
                            onClick={() => copyToClipboard(getShareLink(), 'link')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              copied === 'link'
                                ? 'bg-[#0F5132] text-white'
                                : 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white hover:from-[#8B0000] hover:to-[#C8102E]'
                            }`}
                          >
                            {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#0A3D2E]">Or share just the token:</span>
                          <button
                            onClick={() => copyToClipboard(team.token, 'token')}
                            className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                              copied === 'token'
                                ? 'bg-[#0F5132] text-white'
                                : 'bg-white border-2 border-[#0F5132] text-[#C8102E] hover:bg-[#0F5132] hover:text-white'
                            }`}
                          >
                            {copied === 'token' ? '✓ Copied!' : team.token}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!team.drawComplete && (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleLockTeam(!team.isLocked)}
                        disabled={actionLoading}
                        className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          team.isLocked
                            ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#8B0000] hover:from-[#FFA500] hover:to-[#FFD700]'
                            : 'bg-gradient-to-r from-[#FFF8E7] to-[#FFE5E5] text-[#8B0000] hover:from-[#FFE5E5] hover:to-[#FFF8E7] border-2 border-[#FFD700]'
                        }`}
                      >
                        {team.isLocked ? '🔓 Unlock Team' : '🔒 Lock Team'}
                      </button>

                      <button
                        onClick={handleDraw}
                        disabled={actionLoading || (participants?.length ?? 0) < 3}
                        className="w-full py-4 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white rounded-xl font-bold hover:from-[#0A3D2E] hover:to-[#0F5132] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-lg"
                      >
                        🎄 Run Secret Santa Draw 🎁
                      </button>

                      {(participants?.length ?? 0) < 3 && (
                        <p className="text-sm text-[#C8102E] text-center font-semibold">
                          ⚠️ Need at least 3 participants to run the draw
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* All Assignments (organizer view after draw) */}
                {team.drawComplete && assignments && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-[#0F5132]">
                    <h2 className="text-3xl font-christmas font-bold text-[#0F5132] mb-4 flex items-center gap-2">
                      <span>📋</span>
                      All Assignments
                    </h2>
                    <div className="space-y-2">
                      {assignments.map((a, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border-2 border-[#E8F5E9] rounded-xl p-4 bg-gradient-to-br from-white to-[#FFF8E7] hover:shadow-md transition-all"
                        >
                          <span className="font-bold text-[#0F5132]">{a.giver}</span>
                          <span className="text-2xl">🎁</span>
                          <span className="font-bold text-[#C8102E] text-lg">
                            {a.receiver}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Waiting message for non-organizers before draw */}
            {!isOrganizer && !team.drawComplete && (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border-4 border-[#FFD700]">
                <div className="text-6xl mb-4 animate-bounce">⏳</div>
                <h2 className="text-3xl font-christmas font-bold text-[#C8102E] mb-4">
                  Waiting for Draw
                </h2>
                <p className="text-[#0A3D2E] text-lg font-medium">
                  The organizer hasn&apos;t run the Secret Santa draw yet. Make sure
                  you&apos;ve added your wishlist items! 🎁
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
