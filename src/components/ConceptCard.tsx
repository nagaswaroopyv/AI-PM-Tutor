import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, MessageSquare, Brain } from 'lucide-react'
import type { ConceptCard as ConceptCardType } from '../types'

interface Props {
  concept: ConceptCardType
  onContinue: () => void
  continueLabel?: string
}

export default function ConceptCard({ concept, onContinue, continueLabel = 'Try the scenario →' }: Props) {
  const [revealed, setRevealed] = useState(0)

  const sections = [
    {
      icon: <Brain size={16} className="text-accent" />,
      label: 'The concept',
      content: concept.definition,
    },
    {
      icon: <Lightbulb size={16} className="text-warning" />,
      label: 'Mental model',
      content: concept.mentalModel,
    },
    {
      icon: <MessageSquare size={16} className="text-success" />,
      label: 'What to say in a meeting',
      content: concept.pmTakeaway,
      mono: true,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Term header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">Concept unlocked</span>
        </div>
        <h2 className="font-display text-3xl text-text">{concept.term}</h2>
        <p className="text-muted text-sm">{concept.tagline}</p>
      </motion.div>

      {/* Progressive reveal sections */}
      <div className="space-y-3">
        {sections.map((sec, i) => (
          revealed >= i ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 rounded-xl border border-border bg-surface">
                <div className="flex items-center gap-2 mb-2">
                  {sec.icon}
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">{sec.label}</span>
                </div>
                <p className={`text-sm leading-relaxed text-subtle ${sec.mono ? 'font-mono bg-bg p-3 rounded-lg border border-border/50 text-accent' : ''}`}>
                  {sec.content}
                </p>
              </div>
            </motion.div>
          ) : null
        ))}
      </div>

      {/* Progressive reveal / continue controls */}
      {revealed < sections.length - 1 ? (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="w-full py-3 bg-surface border border-border text-subtle rounded-xl text-sm hover:border-accent/50 hover:text-text transition-all"
        >
          {revealed === 0 ? 'Show mental model →' : 'Show how to use this in meetings →'}
        </button>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onContinue}
          className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          {continueLabel}
        </motion.button>
      )}
    </div>
  )
}
