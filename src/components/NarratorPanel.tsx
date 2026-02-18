import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useVoiceContext } from '../context/VoiceContext'
import { CHARACTERS } from '../characters'
import type { VoiceCharacter } from '../types'
import TypewriterText from './TypewriterText'

interface Props {
  character: VoiceCharacter
  text: string
  onReplay: () => void
}

export default function NarratorPanel({ character, text, onReplay }: Props) {
  const { speaking, muted } = useVoiceContext()
  const char = CHARACTERS[character]

  const handleReplay = useCallback(() => onReplay(), [onReplay])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="p-4 bg-surface border border-border rounded-xl flex gap-4 items-start"
    >
      {/* Avatar */}
      <div
        className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-semibold select-none ${char.avatarClass}`}
      >
        {char.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">

        {/* Name row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text leading-tight">{char.name}</p>
            <p className="text-xs text-muted font-mono">{char.title}</p>
          </div>
          <button
            onClick={handleReplay}
            title="Replay"
            className="flex-shrink-0 mt-0.5 text-muted hover:text-text transition-colors p-1 rounded hover:bg-border/50"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        <div className="border-t border-border/50" />

        {/* Typewriter */}
        <p className="text-sm text-subtle leading-relaxed min-h-[3.5rem]">
          <TypewriterText text={text} speed={90} cursorColor={char.barClass} />
        </p>

        {/* Audio waveform bars — visible while audio plays */}
        <AnimatePresence>
          {speaking && !muted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-end gap-0.5 h-3"
            >
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className={`w-0.5 rounded-full ${char.barClass}`}
                  animate={{ height: ['2px', '10px', '2px'] }}
                  transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.1, ease: 'easeInOut' }}
                  style={{ minHeight: '2px' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
