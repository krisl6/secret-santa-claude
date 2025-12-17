'use client'

import { useEffect, useState } from 'react'

interface ChristmasTreeProps {
  size?: 'small' | 'medium' | 'large'
  position?: 'left' | 'right'
  delay?: number
}

export default function ChristmasTree({ size = 'medium', position = 'left', delay = 0 }: ChristmasTreeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const sizeClasses = {
    small: 'w-24 h-32 md:w-32 md:h-40',
    medium: 'w-32 h-40 md:w-48 md:h-60',
    large: 'w-48 h-60 md:w-64 md:h-80',
  }

  return (
    <div
      className={`${sizeClasses[size]} ${position === 'left' ? 'left-4 md:left-8' : 'right-4 md:right-8'} bottom-8 md:bottom-12 fixed z-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="relative w-full h-full">
        {/* Tree trunk */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-8 md:w-6 md:h-12 bg-[#8B4513] rounded-b-lg z-10"></div>

        {/* Tree layers (from bottom to top) */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-full h-3/4">
          {/* Bottom layer - largest */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[40px] md:border-l-[60px] border-r-[40px] md:border-r-[60px] border-b-[60px] md:border-b-[90px] border-l-transparent border-r-transparent border-b-[#0F5132] animate-tree-sway"></div>
          
          {/* Middle layer */}
          <div className="absolute bottom-[60px] md:bottom-[90px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[30px] md:border-l-[45px] border-r-[30px] md:border-r-[45px] border-b-[50px] md:border-b-[75px] border-l-transparent border-r-transparent border-b-[#0A3D2E] animate-tree-sway-delayed"></div>
          
          {/* Top layer */}
          <div className="absolute bottom-[110px] md:bottom-[165px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] md:border-l-[30px] border-r-[20px] md:border-r-[30px] border-b-[40px] md:border-b-[60px] border-l-transparent border-r-transparent border-b-[#0F5132] animate-tree-sway"></div>

          {/* Star on top */}
          <div className="absolute -top-2 md:-top-4 left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl animate-twinkle z-20">
            ⭐
          </div>

          {/* Ornaments */}
          <div className="absolute bottom-[20px] md:bottom-[30px] left-[20%] text-base md:text-xl animate-bounce-slow z-20">🔴</div>
          <div className="absolute bottom-[50px] md:bottom-[75px] right-[20%] text-base md:text-xl animate-bounce-slow-delayed z-20">🔵</div>
          <div className="absolute bottom-[80px] md:bottom-[120px] left-[25%] text-base md:text-xl animate-bounce-slow z-20">🟡</div>
          <div className="absolute bottom-[50px] md:bottom-[75px] right-[25%] text-base md:text-xl animate-bounce-slow-delayed z-20">🔴</div>
          <div className="absolute bottom-[110px] md:bottom-[165px] left-[30%] text-base md:text-xl animate-bounce-slow z-20">🟢</div>
        </div>
      </div>
    </div>
  )
}

