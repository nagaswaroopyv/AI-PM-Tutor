import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../types'
import CharacterBubble from './CharacterBubble'

interface Props {
  questions: QuizQuestion[]
  onComplete: (xpEarned: number) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent]   = useState(0)
  const [cardsVisible, setCards] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [totalXP, setTotalXP]   = useState(0)
  const [done, setDone]         = useState(false)

  const q = questions[current]

  const goToNext = () => {
    setCards(false)
    setSelected(null)
    setAnswered(false)
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    } else {
      setDone(true)
    }
  }

  const choose = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (q.options[idx].correct) setTotalXP(xp => xp + q.xp)
  }

  const narratorText = `${q.scenario}\n\n${q.question}`
  const selectedOpt  = selected !== null ? q.options[selected] : null
  const correctOpt   = q.options.find(o => o.correct)
  const reactionText = selectedOpt
    ? selectedOpt.correct
      ? selectedOpt.explanation
      : correctOpt?.explanation ?? selectedOpt.explanation
    : ''

  // ─── Done ─────────────────────────────────────────────────────────────────
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

  // ─── Active question ───────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
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
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Before answering */}
          {!answered && (
            <>
              <CharacterBubble
                key={`narrate-${current}`}
                text={narratorText}
                onDone={() => setCards(true)}
              />
              <AnimatePresence>
                {cardsVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {q.options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => choose(idx)}
                        whileTap={{ scale: 0.97 }}
                        className="text-left p-4 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-accent/5 cursor-pointer flex flex-col gap-3 transition-all"
                      >
                        <span className="text-xs font-mono font-bold text-muted">
                          Option {String.fromCharCode(65 + idx)}
                        </span>
                        <p className="text-sm text-text leading-relaxed">{opt.label}</p>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* After answering */}
          {answered && selectedOpt && (
            <>
              <CharacterBubble
                key={`react-${current}`}
                text={reactionText}
                variant={selectedOpt.correct ? 'correct' : 'wrong'}
              />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {q.options.map((opt, idx) => {
                  const state =
                    selected === idx ? (opt.correct ? 'correct' : 'wrong') : 'idle'
                  const cls = {
                    idle:    'border-border bg-surface opacity-40',
                    correct: 'border-success bg-success/10',
                    wrong:   'border-danger  bg-danger/10',
                  }[state]
                  return (
                    <div key={idx} className={`text-left p-4 rounded-xl border flex flex-col gap-3 ${cls}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold ${
                          state === 'correct' ? 'text-success' :
                          state === 'wrong'   ? 'text-danger'  : 'text-muted'
                        }`}>
                          Option {String.fromCharCode(65 + idx)}
                        </span>
                        {state === 'correct' && <CheckCircle size={14} className="text-success" />}
                        {state === 'wrong'   && <XCircle    size={14} className="text-danger"  />}
                      </div>
                      <p className="text-sm text-text leading-relaxed">{opt.label}</p>
                    </div>
                  )
                })}
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={goToNext}
                className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
              >
                {current < questions.length - 1 ? 'Next question →' : 'See results →'}
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
