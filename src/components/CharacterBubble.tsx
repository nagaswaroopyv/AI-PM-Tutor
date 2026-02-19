import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 18, skip = false) {
  const [displayed, setDisplayed] = useState(skip ? text : '')
  const [done, setDone] = useState(skip)

  useEffect(() => {
    if (skip) { setDisplayed(text); setDone(true); return }
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, skip])

  return { displayed, done }
}

// ─── Character definitions ────────────────────────────────────────────────────
export type CharacterId = 'priya' | 'coach'

const CHARACTERS: Record<CharacterId, {
  name: string
  role: string
  avatarUrl: string
  ringColor: string
  nameColor: string
  borderCls: string
  bgCls: string
}> = {
  priya: {
    name: 'Priya Sharma',
    role: 'CPO · SkillPath',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PriyaSharma&backgroundColor=d97706&backgroundType=solid',
    ringColor: 'ring-warning/60',
    nameColor: 'text-warning',
    borderCls: 'border-warning/30',
    bgCls: 'bg-warning/5',
  },
  coach: {
    name: 'PM Coach',
    role: 'Your session guide',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PMCoach&backgroundColor=58a6ff&backgroundType=solid',
    ringColor: 'ring-accent/60',
    nameColor: 'text-accent',
    borderCls: 'border-accent/30',
    bgCls: 'bg-accent/5',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type BubbleVariant = 'default' | 'correct' | 'wrong'

interface Props {
  character?: CharacterId
  text: string
  variant?: BubbleVariant
  onDone?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CharacterBubble({
  character = 'coach',
  text,
  variant = 'default',
  onDone,
}: Props) {
  const [skip, setSkip] = useState(false)
  const { displayed, done } = useTypewriter(text, 18, skip)
  const char = CHARACTERS[character]

  useEffect(() => { setSkip(false) }, [text])
  useEffect(() => {
    if (done && onDone) onDone()
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  // Override colors for correct/wrong feedback states
  const containerCls =
    variant === 'correct' ? 'border-success/40 bg-success/5' :
    variant === 'wrong'   ? 'border-danger/40  bg-danger/5'  :
                            `${char.borderCls} ${char.bgCls}`

  const feedbackLabel =
    variant === 'correct' ? '✓ Right call' :
    variant === 'wrong'   ? '✗ Not quite'  :
                            null

  const feedbackColor =
    variant === 'correct' ? 'text-success' :
    variant === 'wrong'   ? 'text-danger'  :
                            char.nameColor

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-xl overflow-hidden transition-colors ${containerCls} ${!done && variant === 'default' ? 'cursor-pointer' : ''}`}
      onClick={!done && variant === 'default' ? () => setSkip(true) : undefined}
    >
      {/* Character header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Avatar image */}
        <div className={`relative w-14 h-14 rounded-full overflow-hidden ring-2 flex-shrink-0 ${char.ringColor} bg-surface`}>
          <img
            src={char.avatarUrl}
            alt={char.name}
            className="w-full h-full object-cover"
          />
          {/* Pulsing speaking indicator */}
          {!done && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-bg animate-pulse" />
          )}
        </div>

        {/* Name + role */}
        <div>
          <p className={`text-sm font-semibold ${feedbackColor}`}>
            {feedbackLabel ?? char.name}
          </p>
          <p className="text-xs text-muted">{char.role}</p>
        </div>

        {/* Skip hint */}
        {!done && variant === 'default' && (
          <span className="ml-auto text-xs text-muted/40 font-mono">tap to skip →</span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/50 mx-4" />

      {/* Dialogue text */}
      <div className="px-4 py-3">
        <p className="text-sm text-subtle leading-relaxed whitespace-pre-line">
          {displayed}
          {!done && (
            <span className="inline-block w-0.5 h-3.5 bg-accent/60 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </motion.div>
  )
}
