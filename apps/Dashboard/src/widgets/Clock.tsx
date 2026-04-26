import { useState, useEffect } from 'react'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{timeStr}</p>
      <p className="text-gray-500 text-sm mt-2">{dateStr}</p>
    </div>
  )
}
