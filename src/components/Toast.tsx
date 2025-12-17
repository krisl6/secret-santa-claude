'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor =
    type === 'success'
      ? 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E]'
      : type === 'error'
        ? 'bg-gradient-to-r from-[#C8102E] to-[#8B0000]'
        : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]'

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in fixed top-4 right-4 z-50 min-w-[300px] max-w-md`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-1 font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-xl"
      >
        ×
      </button>
    </div>
  )
}

