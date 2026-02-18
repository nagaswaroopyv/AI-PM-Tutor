import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useVoiceContext } from '../context/VoiceContext'
import { CHARACTERS } from '../characters'
import type { VoiceCharacter } from '../types'

interface Props {
  character: VoiceCharacter
  text: string
  onReplay: () => void
}

const BAR_HEIGHTS = ['widget', 'concept', 'tree', 'quiz'] // just for key uniqueness

export default function NarratorPanel({ character, text, onReplay }: Props) {
  const { speaking, muted } = useVoiceContext()
  const char = CHARACTERS[character]

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="p-4 bg-surface border border-border rounded-xl flex gap-4 items-start"
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-medium select-none ${char.avatarClass}`}
      >
        {char.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">

        {/* Name row */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-sm font-medium text-text">{char.name}</span>
            <span className="text-xs text-muted ml-2 font-mono truncate">{char.title}</span>
          </div>
          <button
            onClick={onReplay}
            title="Replay"
            className="text-muted hover:text-text transition-colors flex-shrink-0 p-1"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Quote text */}
        <p className="text-sm text-subtle leading-relaxed">"{text}"</p>

        {/* Animated waveform — visible while speaking */}
        <AnimatePresence>
          {speaking && !muted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-0.5 pt-0.5 h-4"
            >
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full ${char.barClass}`}
                  animate={{ height: ['3px', '14px', '3px'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: 'easeInOut',
                  }}
                  style={{ minHeight: '3px' }}
                />
              ))}
              <span className="text-xs text-muted ml-1.5 font-mono self-center">speaking</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
