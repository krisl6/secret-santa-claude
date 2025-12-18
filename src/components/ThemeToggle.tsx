'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-[#C8102E] dark:border-[#FFD700] hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span className="text-2xl">🌙</span>
      ) : (
        <span className="text-2xl">☀️</span>
      )}
    </button>
  )
}

