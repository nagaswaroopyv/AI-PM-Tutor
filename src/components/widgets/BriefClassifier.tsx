import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, HelpCircle, Hash } from 'lucide-react'
import type { Widget } from '../../types'

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = 'problem' | 'assumption' | 'solution' | 'missing'

interface Statement {
  id: string
  text: string
  correct: Category
  explanation: string
}

interface BriefClassifierConfig {
  context: string
  message: string
  statements: Statement[]
  insight: string
}

interface Props {
  widget: Widget
  onComplete: () => void
}

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES: {
  id: Category
  label: string
  description: string
  textColor: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
}[] = [
  {
    id: 'problem',
    label: 'Real Problem',
    description: 'Observable, measurable pain',
    textColor: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/40',
    icon: <CheckCircle size={12} />,
  },
  {
    id: 'assumption',
    label: 'Assumption',
    description: 'Might be true — needs evidence',
    textColor: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/40',
    icon: <AlertTriangle size={12} />,
  },
  {
    id: 'solution',
    label: 'Solution Disguised',
    description: 'Jumps to how, skips the why',
    textColor: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/40',
    icon: <XCircle size={12} />,
  },
  {
    id: 'missing',
    label: 'Missing Info',
    description: 'Need this before proceeding',
    textColor: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/40',
    icon: <HelpCircle size={12} />,
  },
]

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

// ─── Component ────────────────────────────────────────────────────────────────
export default function BriefClassifier({ widget, onComplete }: Props) {
  const cfg = widget.config as unknown as BriefClassifierConfig
  const [classified, setClassified] = useState<Record<string, Category>>({})
  const [submitted, setSubmitted] = useState(false)
  const [insightVisible, setInsightVisible] = useState(false)

  const allClassified = cfg.statements.every(s => classified[s.id])
  const correctCount = cfg.statements.filter(s => classified[s.id] === s.correct).length

  const classify = (id: string, cat: Category) => {
    if (submitted) return
    setClassified(prev => ({ ...prev, [id]: cat }))
  }

  const submit = () => {
    setSubmitted(true)
    setTimeout(() => setInsightVisible(true), 1200)
  }

  return (
    <div className="space-y-5">

      {/* Slack-style CPO message */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">

        {/* Channel header */}
        <div className="px-4 py-2.5 border-b border-border bg-bg flex items-center gap-2">
          <Hash size={13} className="text-muted" />
          <span className="text-xs font-mono text-subtle font-medium">pm-briefs</span>
          <span className="ml-auto text-xs text-muted font-mono">Monday morning</span>
        </div>

        {/* Message row */}
        <div className="px-4 py-4 flex gap-3">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-lg bg-warning/20 text-warning flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            PS
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-text">Priya Sharma</span>
              <span className="text-xs text-muted font-mono">9:14 AM</span>
              <span className="text-xs text-muted">· CPO, SkillPath</span>
            </div>
            <p className="text-sm text-subtle leading-relaxed whitespace-pre-line">
              {cfg.message}
            </p>
          </div>
        </div>
      </div>

      {/* Category legend */}
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`flex items-start gap-2 p-2.5 rounded-lg border ${cat.bgColor} ${cat.borderColor}`}
          >
            <span className={`mt-0.5 flex-shrink-0 ${cat.textColor}`}>{cat.icon}</span>
            <div>
              <p className={`text-xs font-mono font-medium ${cat.textColor}`}>{cat.label}</p>
              <p className="text-xs text-muted">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statement cards */}
      <div className="space-y-3">
        {cfg.statements.map((stmt, i) => {
          const selected = classified[stmt.id]
          const selCat = selected ? CAT_MAP[selected] : null
          const isCorrect = submitted && selected === stmt.correct
          const isWrong   = submitted && selected && selected !== stmt.correct
          const correctCat = submitted ? CAT_MAP[stmt.correct] : null

          const cardBorder = submitted
            ? isCorrect
              ? 'border-success/50 bg-success/5'
              : isWrong
                ? 'border-danger/40 bg-danger/5'
                : 'border-border'
            : selected
              ? `${selCat!.borderColor} ${selCat!.bgColor}`
              : 'border-border'

          return (
            <motion.div
              key={stmt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`p-4 bg-surface border rounded-xl transition-colors ${cardBorder}`}
            >
              {/* Statement text */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm text-text leading-relaxed flex-1">
                  "{stmt.text}"
                </p>
                {submitted && (
                  <span className={`flex-shrink-0 mt-0.5 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                    {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </span>
                )}
              </div>

              {/* Category buttons (before submit) */}
              {!submitted && (
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => {
                    const isActive = selected === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => classify(stmt.id, cat.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
                          isActive
                            ? `${cat.bgColor} ${cat.textColor} ${cat.borderColor}`
                            : 'border-border text-muted hover:border-muted/60 hover:text-subtle'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Explanation (after submit) */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1"
                >
                  {selCat && (
                    <p className={`text-xs font-mono ${isCorrect ? 'text-success' : 'text-danger'}`}>
                      You said: {selCat.label}
                      {isWrong && correctCat && (
                        <span className="text-muted"> · Correct: {correctCat.label}</span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-muted leading-relaxed">{stmt.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={allClassified ? submit : undefined}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
            allClassified
              ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
              : 'bg-surface border border-border text-muted cursor-not-allowed opacity-50'
          }`}
        >
          {allClassified
            ? 'Check my answers →'
            : `Classify all ${cfg.statements.length} statements to continue`}
        </button>
      )}

      {/* Score */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-surface border border-border rounded-xl text-center space-y-1"
        >
          <p className="font-display text-4xl text-accent">
            {correctCount}/{cfg.statements.length}
          </p>
          <p className="text-sm text-muted">statements correctly classified</p>
        </motion.div>
      )}

      {/* Insight */}
      <AnimatePresence>
        {insightVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl"
          >
            <Lightbulb size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-subtle leading-relaxed">{cfg.insight}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {insightVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onComplete}
          className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          Show me the concept →
        </motion.button>
      )}
    </div>
  )
}
