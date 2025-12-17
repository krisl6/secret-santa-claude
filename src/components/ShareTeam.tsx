'use client'

import { useState } from 'react'

interface ShareTeamProps {
  token: string
}

export default function ShareTeam({ token }: ShareTeamProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const teamUrl = typeof window !== 'undefined' ? `${window.location.origin}/team/${token}` : ''
  const shareText = `Join my Secret Santa team! Token: ${token}\n${teamUrl}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Secret Santa team!',
          text: shareText,
          url: teamUrl,
        })
      } catch (err) {
        // User cancelled or error
        console.error('Share failed:', err)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  // Simple QR code using a service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(teamUrl)}`

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border-2 border-[#0F5132]">
      <h3 className="font-bold text-[#0F5132] mb-3 flex items-center gap-2">
        <span>🔗</span>
        Share Team
      </h3>
      
      <div className="space-y-3">
        {/* Token Display */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] px-4 py-2 rounded-lg border-2 border-[#0F5132]">
            <span className="text-sm text-[#0A3D2E] font-semibold">Token: </span>
            <span className="font-mono font-bold text-[#C8102E] text-lg">{token}</span>
          </div>
          <button
            onClick={() => copyToClipboard(token)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                : 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white hover:from-[#8B0000] hover:to-[#C8102E]'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>

        {/* Share Link */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={teamUrl}
            readOnly
            className="flex-1 px-4 py-2 border-2 border-[#E8F5E9] rounded-lg bg-white text-sm"
          />
          <button
            onClick={() => copyToClipboard(teamUrl)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white'
                : 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white hover:from-[#0A3D2E] hover:to-[#0F5132]'
            }`}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>

        {/* Share Button (native or copy) */}
        <button
          onClick={handleShare}
          className="w-full py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-lg font-bold hover:from-[#8B0000] hover:to-[#C8102E] transition-all shadow-md"
        >
          📤 Share Team
        </button>

        {/* QR Code Toggle */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#8B0000] rounded-lg font-bold hover:from-[#FFA500] hover:to-[#FFD700] transition-all shadow-md"
        >
          {showQR ? '🔼 Hide QR Code' : '📱 Show QR Code'}
        </button>

        {/* QR Code Display */}
        {showQR && (
          <div className="flex flex-col items-center p-4 bg-gradient-to-br from-white to-[#FFF8E7] rounded-lg border-2 border-[#FFD700]">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 border-4 border-[#0F5132] rounded-lg"
            />
            <p className="text-sm text-[#0A3D2E] mt-2 font-semibold text-center">
              Scan to join the team!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

