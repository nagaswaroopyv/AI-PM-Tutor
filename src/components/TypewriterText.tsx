import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  text: string
  speed?: number       // ms per word
  className?: string
  cursorColor?: string // tailwind bg class e.g. 'bg-accent'
}

export default function TypewriterText({
  text,
  speed = 90,
  className = '',
  cursorColor = 'bg-accent',
}: Props) {
  const words = useMemo(() => text.split(' '), [text])
  const [shownCount, setShownCount] = useState(0)

  useEffect(() => {
    setShownCount(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setShownCount(i)
      if (i >= words.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, words.length, speed])

  const isTyping = shownCount < words.length

  return (
    <span className={className}>
      {words.slice(0, shownCount).join(' ')}
      <AnimatePresence>
        {isTyping && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'steps(1)' }}
            className={`inline-block w-px h-[1em] ml-px align-middle ${cursorColor}`}
            style={{ marginBottom: '-2px' }}
          />
        )}
      </AnimatePresence>
    </span>
  )
}
