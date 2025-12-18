'use client'

import { useState, useEffect } from 'react'

interface GuideContent {
  title: string
  steps: string[]
  tips?: string[]
}

interface ContextualGuideProps {
  section: 'organizer' | 'participant' | 'wishlist' | 'assignment' | 'waiting'
  isOrganizer?: boolean
  drawComplete?: boolean
}

const GUIDE_CONTENT: Record<string, GuideContent> = {
  organizer: {
    title: '👑 Organizer Guide',
    steps: [
      '1. Share the team link or token with your teammates',
      '2. Wait for everyone to join and add their wishlist items',
      '3. Set up exclusions if needed (people who shouldn\'t gift each other)',
      '4. When ready, click "Run Secret Santa Draw" to assign givers',
      '5. Everyone will receive their Secret Santa assignment!'
    ],
    tips: [
      'You need at least 3 participants to run the draw',
      'Lock the team to prevent new members from joining',
      'The draw uses smart matching to respect all exclusions'
    ]
  },
  participant: {
    title: '🎁 Getting Started',
    steps: [
      '1. Add 1-3 items to your wishlist that you\'d like to receive',
      '2. Include links and price ranges to help your Secret Santa',
      '3. Wait for the organizer to run the draw',
      '4. You\'ll be assigned someone to gift!',
      '5. Purchase a gift from their wishlist and mark it as purchased'
    ],
    tips: [
      'Be specific with your wishlist items for better results',
      'Add links to make shopping easier for your Secret Santa'
    ]
  },
  wishlist: {
    title: '📝 Your Wishlist',
    steps: [
      '1. Click "Add Item" to add something you\'d like to receive',
      '2. Give it a clear name (e.g., "Blue wireless headphones")',
      '3. Add a description with details (size, color, specs)',
      '4. Include a link to the exact product if possible',
      '5. Specify a price range to match the budget'
    ],
    tips: [
      'You can add up to 3 items',
      'Your Secret Santa will see these items after the draw',
      'Edit or remove items anytime before the draw'
    ]
  },
  assignment: {
    title: '🎅 Your Secret Santa Assignment',
    steps: [
      '1. Check the wishlist of the person you\'re gifting',
      '2. Choose one item to purchase (or get creative!)',
      '3. Buy the gift before the event date',
      '4. Mark as "Purchased" once you\'ve bought it',
      '5. Optionally, add a photo URL to share a preview'
    ],
    tips: [
      'The "Mark Purchased" button helps you track your progress',
      'Your giftee will mark it as "Received" after the event',
      'Keep it a secret until the exchange!'
    ]
  },
  waiting: {
    title: '⏳ What\'s Next?',
    steps: [
      '1. Make sure you\'ve added your wishlist items',
      '2. Set up exclusions if there\'s anyone you can\'t gift',
      '3. Wait for the organizer to run the Secret Santa draw',
      '4. You\'ll be notified when you receive your assignment',
      '5. Check back soon!'
    ],
    tips: [
      'The organizer will run the draw when everyone is ready',
      'You can edit your wishlist anytime before the draw'
    ]
  }
}

export default function ContextualGuide({ section, isOrganizer, drawComplete }: ContextualGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Check if user has seen this guide before
    const hasSeenGuide = localStorage.getItem(`guide_seen_${section}`)
    if (!hasSeenGuide) {
      setIsOpen(true)
    }
  }, [section])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(`guide_seen_${section}`, 'true')
  }

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true)
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  const content = GUIDE_CONTENT[section]

  if (!content) return null

  return (
    <>
      {/* Floating Help Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
          aria-label="Open help guide"
        >
          <span className="text-2xl">💡</span>
          <span className="hidden group-hover:inline-block text-sm font-semibold">Need Help?</span>
        </button>
      )}

      {/* Guide Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#FFD700] transition-all duration-300 ${
            isMinimized ? 'w-64' : 'w-80 md:w-96'
          } max-h-[80vh] overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 flex items-center justify-between">
            <h3 className="font-christmas font-bold text-[#8B0000] text-lg flex items-center gap-2">
              {content.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-[#8B0000] hover:text-[#C8102E] transition-colors"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                <span className="text-xl">{isMinimized ? '📖' : '📕'}</span>
              </button>
              <button
                onClick={handleClose}
                className="text-[#8B0000] hover:text-[#C8102E] transition-colors font-bold text-xl"
                aria-label="Close guide"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {/* Steps */}
              <div className="space-y-3 mb-4">
                {content.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start p-3 bg-gradient-to-r from-[#E8F5E9] to-[#FFF8E7] dark:from-gray-700 dark:to-gray-600 rounded-xl border border-[#0F5132] dark:border-[#90EE90]"
                  >
                    <span className="text-sm text-[#0A3D2E] dark:text-gray-200 leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {content.tips && content.tips.length > 0 && (
                <div className="border-t-2 border-[#FFD700] pt-4">
                  <h4 className="font-bold text-[#0F5132] dark:text-[#90EE90] mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>Pro Tips</span>
                  </h4>
                  <div className="space-y-2">
                    {content.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start"
                      >
                        <span className="text-[#FFD700] text-xs mt-1">✨</span>
                        <span className="text-sm text-[#0A3D2E] dark:text-gray-200">
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-4 border-t-2 border-[#E8F5E9] dark:border-gray-600">
                <button
                  onClick={handleClose}
                  className="w-full py-2 bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white rounded-lg hover:from-[#0A3D2E] hover:to-[#0F5132] transition-all font-semibold text-sm"
                >
                  Got it! ✓
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
