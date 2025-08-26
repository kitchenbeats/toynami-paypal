'use client'

import { useEffect, useState } from 'react'
import { differenceInSeconds, isPast } from 'date-fns'

interface RaffleCountdownProps {
  endDate: string
  label: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function RaffleCountdown({ endDate, label }: RaffleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [ended, setEnded] = useState(false)
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate)
      
      if (isPast(end)) {
        setEnded(true)
        return
      }
      
      const totalSeconds = differenceInSeconds(end, new Date())
      
      const days = Math.floor(totalSeconds / (60 * 60 * 24))
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
      const seconds = totalSeconds % 60
      
      setTimeLeft({ days, hours, minutes, seconds })
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [endDate])
  
  if (ended) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">{label}</h3>
        <div className="text-2xl font-bold text-gray-400">Ended</div>
      </div>
    )
  }
  
  return (
    <div className="text-center">
      <h3 className="text-lg font-bold mb-4">{label}</h3>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-gray-600">Days</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-gray-600">Hours</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-600">Mins</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-600">Secs</div>
        </div>
      </div>
    </div>
  )
}