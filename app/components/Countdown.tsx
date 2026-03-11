'use client'
import { useEffect, useState } from 'react'

export default function Countdown() {
  const weddingDate = new Date('2026-04-20T09:00:00')
  const [days, setDays] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = weddingDate.getTime() - new Date().getTime()
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-2xl font-bold text-rose-600">
      {days} Days to go 💖
    </div>
  )
}