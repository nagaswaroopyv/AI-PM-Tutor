import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, Lightbulb, User } from 'lucide-react'
import type { Widget } from '../../types'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Job {
  id: string
  label: string
  isCorrect: boolean
  explanation: string
}

interface Quote {
  id: string
  quote: string
  speaker: string
  jobs: Job[]
  cluster: string   // which root cause cluster this maps to
}

interface Cluster {
  id: string
  label: string
  description: string
  implication: string
  color: 'danger' | 'warning' | 'success' | 'accent'
}

interface InterviewDecoderConfig {
  context: string
  quotes: Quote[]
  clusters: Cluster[]
  insight: string
}

interface Props {
  widget: Widget
  onComplete: () => void
}

// ─── Color helpers ────────────────────────────────────────────────────────────
const C = {
  danger:  { text: 'text-danger',  bg: 'bg-danger/10',  bar: 'bg-danger',  border: 'border-danger/40'  },
  warning: { text: 'text-warning', bg: 'bg-warning/10', bar: 'bg-warning', border: 'border-warning/40' },
  success: { text: 'text-success', bg: 'bg-success/10', bar: 'bg-success', border: 'border-success/40' },
  accent:  { text: 'text-accent',  bg: 'bg-accent/10',  bar: 'bg-accent',  border: 'border-accent/40'  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function InterviewDecoder({ widget, onComplete }: Props) {
  const cfg = widget.config as unknown as InterviewDecoderConfig

  const [current, setCurrent]   = useState(0)
  const [answers, setAnswers]   = useState<Record<string, string>>({})    // quoteId → jobId
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})  // quoteId → answered
  const [finished, setFinished] = useState(false)
  const [insightVisible, setInsightVisible] = useState(false)

  const quote      = cfg.quotes[current]
  const isAnswered = !!revealed[quote?.id]
  const selectedId = answers[quote?.id]

  const select = (jobId: string) => {
    if (isAnswered) return
    setAnswers(prev => ({ ...prev, [quote.id]: jobId }))
    setRevealed(prev => ({ ...prev, [quote.id]: true }))
  }

  const advance = () => {
    if (current < cfg.quotes.length - 1) {
      setCurrent(c => c + 1)
    } else {
      setFinished(true)
      setTimeout(() => setInsightVisible(true), 700)
    }
  }

  // Cluster counts for synthesis
  const clusterCounts = cfg.quotes.reduce<Record<string, number>>((acc, q) => {
    acc[q.cluster] = (acc[q.cluster] ?? 0) + 1
    return acc
  }, {})

  const dominant = cfg.clusters.reduce((a, b) =>
    (clusterCounts[a.id] ?? 0) >= (clusterCounts[b.id] ?? 0) ? a : b
  )

  // ─── Synthesis view ─────────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="space-y-5">

        {/* Cluster chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-surface border border-border rounded-xl space-y-5"
        >
          <p className="text-xs font-mono text-muted uppercase tracking-wider">
            Interview synthesis · {cfg.quotes.length} lapsed learners
          </p>

          {cfg.clusters.map((cluster, i) => {
            const count = clusterCounts[cluster.id] ?? 0
            const pct   = (count / cfg.quotes.length) * 100
            const c     = C[cluster.color]

            return (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${c.text}`}>{cluster.label}</span>
                  <span className="text-xs font-mono text-muted">
                    {count} of {cfg.quotes.length} learners
                  </span>
                </div>

                {/* Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                      className={`h-2 rounded-full ${c.bar}`}
                    />
                  </div>
                  {/* Dot indicators */}
                  <div className="flex gap-1 flex-shrink-0">
                    {Array.from({ length: cfg.quotes.length }).map((_, j) => (
                      <div
                        key={j}
                        className={`w-2 h-2 rounded-full transition-colors ${j < count ? c.bar : 'bg-border'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted">{cluster.implication}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Dominant finding callout */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-xl border ${C[dominant.color].bg} ${C[dominant.color].border}`}
        >
          <p className={`text-xs font-mono font-medium uppercase tracking-wider mb-1 ${C[dominant.color].text}`}>
            Dominant finding
          </p>
          <p className="text-sm text-text font-medium">{dominant.label}</p>
          <p className="text-xs text-subtle mt-1 leading-relaxed">{dominant.description}</p>
        </motion.div>

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

  // ─── Quote-by-quote view ────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Research context */}
      <div className="p-4 bg-surface border border-border rounded-xl">
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Research context</p>
        <p className="text-sm text-subtle leading-relaxed">{cfg.context}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted">
          Quote {current + 1} of {cfg.quotes.length}
        </span>
        <div className="flex gap-1.5">
          {cfg.quotes.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i < current ? 'bg-success' : i === current ? 'bg-accent' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quote + options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Quote card */}
          <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <User size={13} className="text-muted flex-shrink-0" />
              <p className="text-xs font-mono text-muted">{quote.speaker}</p>
            </div>
            <p className="text-sm text-text leading-relaxed italic">"{quote.quote}"</p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-text">
            What job was this learner trying to hire SkillPath to do?
          </p>

          {/* Job options */}
          <div className="space-y-2">
            {quote.jobs.map((job, idx) => {
              let state: 'idle' | 'correct' | 'wrong' | 'missed' = 'idle'
              if (isAnswered) {
                if (job.id === selectedId)  state = job.isCorrect ? 'correct' : 'wrong'
                else if (job.isCorrect)     state = 'missed'
              }
              const cls = {
                idle:    'border-border bg-surface hover:border-accent/50 hover:bg-accent/5 cursor-pointer',
                correct: 'border-success bg-success/10 cursor-default',
                wrong:   'border-danger  bg-danger/10  cursor-default',
                missed:  'border-success/40 bg-success/5 cursor-default opacity-60',
              }[state]

              return (
                <motion.button
                  key={job.id}
                  onClick={() => select(job.id)}
                  disabled={isAnswered}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${cls}`}
                >
                  <span className={`text-xs font-mono mt-0.5 w-4 flex-shrink-0 ${
                    state === 'correct' ? 'text-success'
                    : state === 'wrong' ? 'text-danger'
                    : 'text-muted'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text">{job.label}</p>
                    {isAnswered && (state === 'correct' || state === 'wrong') && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-muted mt-1.5 leading-relaxed"
                      >
                        {job.explanation}
                      </motion.p>
                    )}
                    {isAnswered && state === 'missed' && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-success/80 mt-1.5 leading-relaxed"
                      >
                        This was the underlying job. {job.explanation}
                      </motion.p>
                    )}
                  </div>
                  {isAnswered && state === 'correct' && <CheckCircle size={15} className="text-success flex-shrink-0 mt-0.5" />}
                  {isAnswered && state === 'wrong'   && <XCircle    size={15} className="text-danger  flex-shrink-0 mt-0.5" />}
                </motion.button>
              )
            })}
          </div>

          {/* Advance */}
          {isAnswered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={advance}
              className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              {current < cfg.quotes.length - 1
                ? <><span>Next quote</span><ChevronRight size={16} /></>
                : <span>See the synthesis →</span>
              }
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
