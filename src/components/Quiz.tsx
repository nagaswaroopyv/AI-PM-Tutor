import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../types'

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

// ─── Character bubble ─────────────────────────────────────────────────────────
type BubbleVariant = 'default' | 'correct' | 'wrong'

function CharacterBubble({
  text,
  variant = 'default',
  onDone,
}: {
  text: string
  variant?: BubbleVariant
  onDone?: () => void
}) {
  const [skip, setSkip] = useState(false)
  const { displayed, done } = useTypewriter(text, 18, skip)

  // Reset skip state when text changes (new question)
  useEffect(() => { setSkip(false) }, [text])

  useEffect(() => {
    if (done && onDone) onDone()
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  const containerCls =
    variant === 'correct' ? 'border-success/40 bg-success/5' :
    variant === 'wrong'   ? 'border-danger/40  bg-danger/5'  :
                            'border-border      bg-surface'

  const avatarCls =
    variant === 'correct' ? 'bg-success/20 text-success' :
    variant === 'wrong'   ? 'bg-danger/20  text-danger'  :
                            'bg-accent/20  text-accent'

  const labelCls =
    variant === 'correct' ? 'text-success' :
    variant === 'wrong'   ? 'text-danger'  :
                            'text-muted'

  const label =
    variant === 'correct' ? '✓ Right call' :
    variant === 'wrong'   ? '✗ Not quite'  :
                            'PM Coach'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-4 border rounded-xl transition-colors ${containerCls} ${!done && variant === 'default' ? 'cursor-pointer' : ''}`}
      onClick={!done && variant === 'default' ? () => setSkip(true) : undefined}
    >
      {/* Avatar */}
      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${avatarCls}`}>
        PM
        {/* Pulse dot while typing */}
        {!done && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg animate-pulse" />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-mono mb-1.5 ${labelCls}`}>{label}</p>
        <p className="text-sm text-subtle leading-relaxed whitespace-pre-line">
          {displayed}
          {!done && (
            <span className="inline-block w-0.5 h-3.5 bg-accent/60 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
        {!done && variant === 'default' && (
          <p className="text-xs text-muted/50 font-mono mt-2">tap to skip →</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  questions: QuizQuestion[]
  onComplete: (xpEarned: number) => void
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export default function Quiz({ questions, onComplete }: Props) {
  const [current, setCurrent]       = useState(0)
  const [cardsVisible, setCards]    = useState(false)
  const [selected, setSelected]     = useState<number | null>(null)
  const [answered, setAnswered]     = useState(false)
  const [totalXP, setTotalXP]       = useState(0)
  const [done, setDone]             = useState(false)

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

  // Narrator text = scenario + question (typed out together)
  const narratorText = `${q.scenario}\n\n${q.question}`

  const selectedOpt = selected !== null ? q.options[selected] : null
  const correctOpt  = q.options.find(o => o.correct)
  const reactionText = selectedOpt
    ? selectedOpt.correct
      ? selectedOpt.explanation
      : correctOpt?.explanation ?? selectedOpt.explanation
    : ''

  // ─── Done screen ─────────────────────────────────────────────────────────
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

  // ─── Active question ──────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Progress */}
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

          {/* ── Before answering ── */}
          {!answered && (
            <>
              {/* Character presents the scenario */}
              <CharacterBubble
                key={`narrate-${current}`}
                text={narratorText}
                variant="default"
                onDone={() => setCards(true)}
              />

              {/* A/B cards fade in after character finishes */}
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

          {/* ── After answering ── */}
          {answered && selectedOpt && (
            <>
              {/* Character reacts */}
              <CharacterBubble
                key={`react-${current}`}
                text={reactionText}
                variant={selectedOpt.correct ? 'correct' : 'wrong'}
              />

              {/* Cards stay — highlighted correct / wrong */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {q.options.map((opt, idx) => {
                  const state =
                    selected === idx
                      ? opt.correct ? 'correct' : 'wrong'
                      : 'idle'

                  const cls = {
                    idle:    'border-border bg-surface opacity-40',
                    correct: 'border-success bg-success/10',
                    wrong:   'border-danger  bg-danger/10',
                  }[state]

                  return (
                    <div
                      key={idx}
                      className={`text-left p-4 rounded-xl border flex flex-col gap-3 transition-all ${cls}`}
                    >
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
