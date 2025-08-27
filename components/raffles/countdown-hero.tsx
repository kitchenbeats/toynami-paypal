'use client'

import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'

interface CountdownHeroProps {
  registrationStartsAt: string
  registrationEndsAt: string
  drawDate: string
  status: 'upcoming' | 'open' | 'closed' | 'drawing' | 'drawn'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownHero({ registrationStartsAt, registrationEndsAt, drawDate, status }: CountdownHeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [currentPhase, setCurrentPhase] = useState<'upcoming' | 'open' | 'waiting_draw' | 'ended'>('upcoming')
  const [targetDate, setTargetDate] = useState<string>(registrationStartsAt)
  const [label, setLabel] = useState<string>('Registration Opens In')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const startDate = new Date(registrationStartsAt)
      const endDate = new Date(registrationEndsAt)
      const drawDateTime = new Date(drawDate)
      
      let target: Date
      let phase: 'upcoming' | 'open' | 'waiting_draw' | 'ended'
      let displayLabel: string
      
      // Determine which countdown to show based on current time
      if (now < startDate) {
        // Before registration opens
        target = startDate
        phase = 'upcoming'
        displayLabel = 'Registration Opens In'
      } else if (now >= startDate && now < endDate) {
        // Registration is open
        target = endDate
        phase = 'open'
        displayLabel = 'Registration Closes In'
      } else if (now >= endDate && now < drawDateTime) {
        // Registration closed, waiting for draw
        target = drawDateTime
        phase = 'waiting_draw'
        displayLabel = 'Drawing Begins In'
      } else {
        // All dates have passed
        target = drawDateTime
        phase = 'ended'
        displayLabel = 'Raffle Ended'
      }
      
      setCurrentPhase(phase)
      setTargetDate(target.toISOString())
      setLabel(displayLabel)
      
      if (phase === 'ended') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      const seconds = differenceInSeconds(target, now)
      
      if (seconds <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      const days = Math.floor(seconds / (3600 * 24))
      const hours = Math.floor((seconds % (3600 * 24)) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      
      setTimeLeft({ days, hours, minutes, seconds: secs })
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [registrationStartsAt, registrationEndsAt, drawDate])
  
  if (!mounted) {
    return null
  }
  
  if (status === 'drawing') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-950 border border-gray-800 rounded-lg p-8"
      >
        <h3 className="text-2xl font-semibold text-center text-gray-100">Drawing in Progress</h3>
      </motion.div>
    )
  }
  
  if (status === 'drawn') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-950 border border-gray-800 rounded-lg p-8"
      >
        <h3 className="text-2xl font-semibold text-center text-gray-100">Winners Selected</h3>
      </motion.div>
    )
  }
  
  if (currentPhase === 'ended' || (currentPhase === 'waiting_draw' && status === 'closed')) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-950 border border-gray-800 rounded-lg p-8"
      >
        <h3 className="text-2xl font-semibold text-center text-gray-100">
          {currentPhase === 'waiting_draw' ? 'Registration Closed' : 'Raffle Ended'}
        </h3>
      </motion.div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Countdown Label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-400 tracking-wider uppercase">
              {label}
            </h2>
          </div>
          
          {/* Time Display */}
          <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
            {Object.entries({ days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' }).map(([key, label]) => (
              <div key={key}>
                <div className="bg-gray-950 border border-gray-800 p-3 md:p-4 rounded">
                  <motion.div
                    key={`${key}-${timeLeft[key as keyof TimeLeft]}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200,
                      damping: 15
                    }}
                    className="text-2xl md:text-3xl font-semibold text-gray-100"
                  >
                    {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
                  </motion.div>
                </div>
                <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
          
          {/* Target Date */}
          <p className="text-sm text-gray-500">
            <span className="text-gray-400 font-medium">
              {new Date(targetDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </p>
          
          {/* Urgency Message - Simplified */}
          {currentPhase === 'open' && timeLeft.days === 0 && timeLeft.hours < 24 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm mt-4"
            >
              Final hours to enter
            </motion.div>
          )}
          
          {currentPhase === 'upcoming' && timeLeft.days === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm mt-4"
            >
              Starting soon
            </motion.div>
          )}
          
          {currentPhase === 'waiting_draw' && timeLeft.hours < 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm mt-4"
            >
              Drawing starting soon
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}