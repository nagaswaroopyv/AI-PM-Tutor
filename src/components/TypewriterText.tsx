import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlaybackInfo } from '../context/VoiceContext'

interface Props {
  text: string
  // Triggered mode: waits for playback to start, types at audio-matched speed
  trigger?: PlaybackInfo | null
  // Auto mode (no trigger): types immediately at this fixed speed
  speed?: number
  className?: string
  cursorColor?: string
}

export default function TypewriterText({
  text,
  trigger,
  speed = 90,
  className = '',
  cursorColor = 'bg-accent',
}: Props) {
  const words        = useMemo(() => text.trim().split(/\s+/), [text])
  const isSynced     = trigger !== undefined  // true = wait for audio
  const [shownCount, setShownCount] = useState(0)

  // AUTO mode — start immediately when text changes
  useEffect(() => {
    if (isSynced) return
    setShownCount(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setShownCount(i)
      if (i >= words.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, words.length, speed, isSynced])

  // SYNCED mode — start only when audio begins (trigger.token changes)
  useEffect(() => {
    if (!isSynced || !trigger) return
    setShownCount(0)
    let i = 0
    const ms = Math.max(60, trigger.msPerWord)  // never faster than 60ms/word
    const id = setInterval(() => {
      i++
      setShownCount(i)
      if (i >= words.length) clearInterval(id)
    }, ms)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.token, isSynced, words.length])

  // In synced mode with no trigger yet → show nothing (loading handled by parent)
  if (isSynced && !trigger) return null

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
