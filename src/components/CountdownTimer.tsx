'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  eventDate: string
}

export default function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const event = new Date(eventDate).getTime()
      const difference = event - now

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false,
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  if (timeLeft.isPast) {
    return (
      <div className="bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-xl p-4 text-center">
        <div className="text-2xl font-christmas font-bold">🎄 Event Has Passed! 🎁</div>
      </div>
    )
  }

  const isUrgent = timeLeft.days <= 7

  return (
    <div
      className={`rounded-xl p-4 text-center border-4 ${
        isUrgent
          ? 'bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white border-[#FFD700] animate-pulse'
          : 'bg-gradient-to-r from-[#0F5132] to-[#0A3D2E] text-white border-[#FFD700]'
      }`}
    >
      <div className="text-lg font-christmas font-bold mb-2">
        {isUrgent ? '⏰ Time Until Event!' : '⏳ Time Until Event'}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs md:text-sm">Days</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs md:text-sm">Hours</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs md:text-sm">Minutes</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs md:text-sm">Seconds</div>
        </div>
      </div>
    </div>
  )
}

