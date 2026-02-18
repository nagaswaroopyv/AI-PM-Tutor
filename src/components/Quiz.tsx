import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../types'

interface Props {
  questions: QuizQuestion[]
  onComplete: (xpEarned: number) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [totalXP, setTotalXP]   = useState(0)
  const [done, setDone]         = useState(false)

  const q = questions[current]

  const choose = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (q.options[idx].correct) {
      setTotalXP(xp => xp + q.xp)
    }
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    const maxXP = questions.reduce((s, q) => s + q.xp, 0)
    const pct   = Math.round((totalXP / maxXP) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 text-center py-4"
      >
        <p className="text-xs font-mono text-muted uppercase tracking-wider">Quiz complete</p>
        <p className="font-display text-5xl text-accent">{pct}%</p>
        <p className="text-muted text-sm">+{totalXP} XP earned</p>
        <button
          onClick={() => onComplete(totalXP)}
          className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          Finish session →
        </button>
      </motion.div>
    )
  }

  const selectedOpt = selected !== null ? q.options[selected] : null
  const correctOpt  = q.options.find(o => o.correct)

  return (
    <div className="space-y-5">

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-border rounded-full h-1">
          <div
            className="bg-accent h-1 rounded-full transition-all duration-500"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted font-mono">{current + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-5"
        >

          {/* Scenario */}
          <div className="p-4 bg-surface border border-border rounded-xl">
            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Scenario</p>
            <p className="text-sm text-subtle leading-relaxed">{q.scenario}</p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-text leading-relaxed">{q.question}</p>

          {/* A/B Decision Cards */}
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              let state: 'idle' | 'correct' | 'wrong' = 'idle'
              if (answered && selected === idx) {
                state = opt.correct ? 'correct' : 'wrong'
              }

              const cls = {
                idle:    'border-border bg-surface hover:border-accent/40 hover:bg-accent/5 cursor-pointer',
                correct: 'border-success bg-success/10 cursor-default',
                wrong:   'border-danger bg-danger/10 cursor-default',
              }[state]

              return (
                <motion.button
                  key={idx}
                  onClick={() => choose(idx)}
                  whileTap={!answered ? { scale: 0.97 } : {}}
                  className={`relative text-left p-4 rounded-xl border transition-all flex flex-col gap-3 ${cls}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      state === 'correct' ? 'text-success' :
                      state === 'wrong'   ? 'text-danger'  : 'text-muted'
                    }`}>
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    {answered && state === 'correct' && <CheckCircle size={14} className="text-success" />}
                    {answered && state === 'wrong'   && <XCircle    size={14} className="text-danger"  />}
                  </div>
                  <p className="text-sm text-text leading-relaxed">{opt.label}</p>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation panel */}
          <AnimatePresence>
            {answered && selectedOpt && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl border ${
                  selectedOpt.correct
                    ? 'bg-success/5 border-success/30'
                    : 'bg-danger/5 border-danger/30'
                }`}
              >
                <p className={`text-xs font-mono font-medium mb-2 ${
                  selectedOpt.correct ? 'text-success' : 'text-danger'
                }`}>
                  {selectedOpt.correct ? '✓ Right call' : '✗ Not quite'}
                </p>
                <p className="text-sm text-subtle leading-relaxed">
                  {selectedOpt.correct
                    ? selectedOpt.explanation
                    : correctOpt?.explanation ?? selectedOpt.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={next}
              className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
            >
              {current < questions.length - 1 ? 'Next question →' : 'See results →'}
            </motion.button>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
