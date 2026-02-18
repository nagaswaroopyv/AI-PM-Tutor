import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import type { SessionData } from '../types'
import BriefClassifier from '../components/widgets/BriefClassifier'
import InterviewDecoder from '../components/widgets/InterviewDecoder'
import ConceptCard from '../components/ConceptCard'
import DecisionTree from '../components/DecisionTree'
import Quiz from '../components/Quiz'
import { useVoiceContext } from '../context/VoiceContext'

type Phase = 'widget' | 'concept' | 'tree' | 'quiz' | 'done'

interface Props {
  session: SessionData
  stageTitle: string
  onBack: () => void
  onComplete: (xpEarned: number) => void
}

export default function SessionPlayer({ session, stageTitle, onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('widget')
  const [xpEarned, setXpEarned] = useState(0)
  const { speak, stop } = useVoiceContext()

  const addXP = (amount: number) => setXpEarned(x => x + amount)

  // Auto-play voice narration when phase changes
  useEffect(() => {
    const script = session.voiceScript
    if (!script) return
    const phaseKey = phase as keyof typeof script
    const voice = script[phaseKey]
    if (voice) {
      // Small delay so animation starts first
      const t = setTimeout(() => speak(voice.text, voice.character), 400)
      return () => clearTimeout(t)
    }
  }, [phase, session.voiceScript, speak])

  // Stop narration when leaving the session
  useEffect(() => () => stop(), [stop])

  const renderWidget = () => {
    const props = {
      widget: session.widget,
      onComplete: () => setPhase('concept'),
    }
    switch (session.widget.type) {
      case 'brief-classifier':  return <BriefClassifier  {...props} />
      case 'interview-decoder': return <InterviewDecoder {...props} />
      default: return <p className="text-muted text-sm">Widget not yet implemented.</p>
    }
  }

  if (phase === 'done') {
    const pct = Math.round((xpEarned / session.totalXP) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto py-16 text-center space-y-6"
      >
        <p className="text-xs font-mono text-muted uppercase tracking-widest">
          Session {session.id} complete
        </p>
        <h2 className="font-display text-4xl text-text">{session.title}</h2>

        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <p className="font-display text-5xl text-accent">{xpEarned}</p>
            <p className="text-xs text-muted mt-1">XP earned</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display text-5xl text-success">{pct}%</p>
            <p className="text-xs text-muted mt-1">Score</p>
          </div>
        </div>

        {/* Skills unlocked */}
        <div className="p-4 bg-surface border border-border rounded-xl text-left space-y-2">
          <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">Skill unlocked</p>
          <div className="flex items-start gap-3">
            <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-text">{session.concept.term}</p>
              <p className="text-xs text-muted">{session.concept.tagline}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-surface border border-border text-subtle rounded-xl text-sm hover:border-accent/50 hover:text-text transition-all"
          >
            Back to curriculum
          </button>
          <button
            onClick={() => onComplete(xpEarned)}
            className="flex-1 py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors text-sm"
          >
            Next session →
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Back + session header */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={14} />
          {stageTitle}
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              Session {session.id}
            </span>
          </div>
          <h1 className="font-display text-3xl text-text">{session.title}</h1>
        </div>
      </div>

      {/* Phase content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Phase label */}
          <PhaseLabel phase={phase} widgetTitle={session.widget.title} />

          {/* Widget */}
          {phase === 'widget' && (
            <div className="space-y-3">
              <p className="text-sm text-muted">{session.widget.subtitle}</p>
              {renderWidget()}
            </div>
          )}

          {/* Concept */}
          {phase === 'concept' && (
            <ConceptCard
              concept={session.concept}
              onContinue={() => {
                if (session.decisionTree) setPhase('tree')
                else setPhase('quiz')
              }}
              continueLabel={session.decisionTree ? 'Try the scenario →' : 'Test yourself →'}
            />
          )}

          {/* Decision tree */}
          {phase === 'tree' && session.decisionTree && (
            <DecisionTree
              tree={session.decisionTree}
              onComplete={(xp) => {
                addXP(xp)
                setPhase('quiz')
              }}
            />
          )}

          {/* Quiz */}
          {phase === 'quiz' && (
            <Quiz
              questions={session.quiz}
              onComplete={(xp) => {
                addXP(xp)
                setPhase('done')
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* XP progress bar */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs text-muted font-mono">{xpEarned} XP</span>
        <div className="flex-1 bg-border rounded-full h-1.5">
          <motion.div
            className="bg-accent h-1.5 rounded-full"
            animate={{ width: `${Math.min(100, (xpEarned / session.totalXP) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted font-mono">{session.totalXP}</span>
      </div>
    </div>
  )
}

// ─── Phase label ──────────────────────────────────────────────────────────────
function PhaseLabel({ phase, widgetTitle }: { phase: Phase; widgetTitle: string }) {
  const labels: Record<Phase, { tag: string; title: string; color: string }> = {
    widget:  { tag: '01', title: widgetTitle,   color: 'text-accent' },
    concept: { tag: '02', title: 'Concept',      color: 'text-warning' },
    tree:    { tag: '03', title: 'Scenario',     color: 'text-success' },
    quiz:    { tag: '04', title: 'Apply it',     color: 'text-success' },
    done:    { tag: '✓',  title: 'Complete',     color: 'text-success' },
  }
  const l = labels[phase]
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-mono font-medium ${l.color} border border-current rounded px-1.5 py-0.5`}>
        {l.tag}
      </span>
      <span className="text-sm font-medium text-text">{l.title}</span>
    </div>
  )
}
