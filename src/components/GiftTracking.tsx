'use client'

import { useState } from 'react'

interface GiftTrackingProps {
  assignmentId: string
  token: string
  participantId: string
  receiverName: string
  initialIsPurchased: boolean
  initialIsReceived: boolean
  initialPhotoUrl: string | null
  initialThankYouMessage: string | null
  isReceiver: boolean
}

export default function GiftTracking({
  assignmentId,
  token,
  participantId,
  receiverName,
  initialIsPurchased,
  initialIsReceived,
  initialPhotoUrl,
  initialThankYouMessage,
  isReceiver,
}: GiftTrackingProps) {
  const [isPurchased, setIsPurchased] = useState(initialIsPurchased)
  const [isReceived, setIsReceived] = useState(initialIsReceived)
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || '')
  const [thankYouMessage, setThankYouMessage] = useState(initialThankYouMessage || '')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (field: string, value: unknown) => {
    setLoading(true)
    try {
      const updateData: Record<string, unknown> = { token, participantId }
      updateData[field] = value

      const response = await fetch('/api/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const result = await response.json()
        alert(result.error || 'Failed to update')
        return
      }

      if (field === 'isPurchased') setIsPurchased(value as boolean)
      if (field === 'isReceived') setIsReceived(value as boolean)
      if (field === 'photoUrl') setPhotoUrl(value as string)
      if (field === 'thankYouMessage') setThankYouMessage(value as string)
    } catch (err) {
      alert('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border-2 border-[#FFD700]">
      <h3 className="font-bold text-[#0F5132] mb-4 flex items-center gap-2">
        <span>🎁</span>
        Gift Tracking
      </h3>

      {!isReceiver ? (
        // Giver view
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] rounded-lg">
            <span className="font-semibold text-[#0F5132]">Mark as Purchased</span>
            <button
              onClick={() => handleUpdate('isPurchased', !isPurchased)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isPurchased
                  ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isPurchased ? '✓ Purchased' : 'Mark Purchased'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F5132] mb-2">
              Photo URL (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
              />
              <button
                onClick={() => handleUpdate('photoUrl', photoUrl)}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-lg hover:from-[#8B0000] hover:to-[#C8102E] transition-all font-semibold"
              >
                Save
              </button>
            </div>
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Gift photo"
                className="mt-2 rounded-lg max-w-full h-48 object-cover border-2 border-[#0F5132]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        </div>
      ) : (
        // Receiver view
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] rounded-lg">
            <span className="font-semibold text-[#0F5132]">Mark as Received</span>
            <button
              onClick={() => handleUpdate('isReceived', !isReceived)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isReceived
                  ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isReceived ? '✓ Received' : 'Mark Received'}
            </button>
          </div>

          {isReceived && (
            <div>
              <label className="block text-sm font-semibold text-[#0F5132] mb-2">
                Thank You Message (optional)
              </label>
              <textarea
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                placeholder="Thank you for the gift!"
                rows={3}
                className="w-full px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all"
              />
              <button
                onClick={() => handleUpdate('thankYouMessage', thankYouMessage)}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-lg hover:from-[#8B0000] hover:to-[#C8102E] transition-all font-semibold"
              >
                Save Message
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

