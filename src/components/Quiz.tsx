import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../types'

interface Props {
  questions: QuizQuestion[]
  onComplete: (xpEarned: number) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[current]
  const isCorrect = selected !== null && q.options[selected]?.correct

  const choose = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (q.options[idx]?.correct) setTotalXP(xp => xp + q.xp)
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
    const pct = Math.round((totalXP / maxXP) * 100)
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
          Next concept →
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-border rounded-full h-1">
          <div
            className="bg-accent h-1 rounded-full transition-all duration-500"
            style={{ width: `${((current) / questions.length) * 100}%` }}
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
          {/* Scenario context */}
          <div className="p-4 bg-surface border border-border rounded-xl">
            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Fresh scenario</p>
            <p className="text-sm text-subtle leading-relaxed">{q.scenario}</p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-text leading-relaxed">{q.question}</p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let state: 'idle' | 'correct' | 'wrong' | 'missed' = 'idle'
              if (answered) {
                if (idx === selected) state = opt.correct ? 'correct' : 'wrong'
                else if (opt.correct) state = 'missed'
              }
              const cls = {
                idle:    'border-border bg-surface hover:border-accent/50 hover:bg-accent/5 cursor-pointer',
                correct: 'border-success bg-success/10 cursor-default',
                wrong:   'border-danger bg-danger/10 cursor-default',
                missed:  'border-success/50 bg-success/5 cursor-default opacity-70',
              }[state]

              return (
                <motion.button
                  key={idx}
                  onClick={() => choose(idx)}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${cls}`}
                >
                  <span className={`text-xs font-mono mt-0.5 w-5 flex-shrink-0 ${
                    state === 'correct' ? 'text-success' : state === 'wrong' ? 'text-danger' : 'text-muted'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text">{opt.label}</p>
                    {answered && idx === selected && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-muted mt-2 leading-relaxed"
                      >
                        {opt.explanation}
                      </motion.p>
                    )}
                    {answered && state === 'missed' && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-success/80 mt-2 leading-relaxed"
                      >
                        ← This was the correct answer. {opt.explanation}
                      </motion.p>
                    )}
                  </div>
                  {answered && state === 'correct' && <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />}
                  {answered && state === 'wrong'   && <XCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />}
                </motion.button>
              )
            })}
          </div>

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
