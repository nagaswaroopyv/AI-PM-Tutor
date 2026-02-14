import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Lock } from 'lucide-react'
import type { DayData, ConceptCluster } from '../types'
import ThresholdSlider from '../components/widgets/ThresholdSlider'
import DragRank from '../components/widgets/DragRank'
import ConceptCard from '../components/ConceptCard'
import DecisionTree from '../components/DecisionTree'
import Quiz from '../components/Quiz'

type Phase = 'widget' | 'concept' | 'tree' | 'quiz' | 'done'

interface ClusterState {
  phase: Phase
  xp: number
}

interface Props {
  day: DayData
  onDayComplete?: (totalXP: number) => void
}

export default function DayPlayer({ day, onDayComplete }: Props) {
  const [activeCluster, setActiveCluster] = useState(0)
  const [clusterStates, setClusterStates] = useState<ClusterState[]>(
    day.clusters.map(() => ({ phase: 'widget', xp: 0 }))
  )
  const [totalXP, setTotalXP] = useState(0)
  const [dayDone, setDayDone] = useState(false)

  const setPhase = (clusterIdx: number, phase: Phase) => {
    setClusterStates(prev => {
      const next = [...prev]
      next[clusterIdx] = { ...next[clusterIdx], phase }
      return next
    })
  }

  const addXP = (amount: number) => setTotalXP(x => x + amount)

  const advanceCluster = () => {
    if (activeCluster < day.clusters.length - 1) {
      setActiveCluster(activeCluster + 1)
    } else {
      setDayDone(true)
      onDayComplete?.(totalXP)
    }
  }

  const cluster = day.clusters[activeCluster]
  const state = clusterStates[activeCluster]

  const renderWidget = (c: ConceptCluster) => {
    const props = {
      widget: c.widget,
      onComplete: () => setPhase(activeCluster, 'concept'),
    }
    switch (c.widget.type) {
      case 'threshold-slider': return <ThresholdSlider {...props} />
      case 'drag-rank':        return <DragRank {...props} />
      default:                 return <p className="text-muted text-sm">Widget type not yet implemented.</p>
    }
  }

  if (dayDone) {
    const pct = Math.round((totalXP / day.totalXP) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto py-16 text-center space-y-6"
      >
        <p className="text-xs font-mono text-muted uppercase tracking-widest">Day {day.dayNumber} complete</p>
        <h2 className="font-display text-4xl text-text">{day.title}</h2>
        <div className="flex items-center justify-center gap-6 py-6">
          <div className="text-center">
            <p className="font-display text-5xl text-accent">{totalXP}</p>
            <p className="text-xs text-muted mt-1">XP earned</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display text-5xl text-success">{pct}%</p>
            <p className="text-xs text-muted mt-1">Score</p>
          </div>
        </div>
        <div className="space-y-2">
          {day.clusters.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl text-left">
              <CheckCircle size={16} className="text-success flex-shrink-0" />
              <div>
                <p className="text-sm text-text">{c.concept.term}</p>
                <p className="text-xs text-muted">{c.concept.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Day header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">Day {day.dayNumber}</span>
          <span className="text-muted">·</span>
          <span className="text-xs font-mono text-muted">{day.scenario.industry}</span>
        </div>
        <h1 className="font-display text-3xl text-text">{day.title}</h1>
        <p className="text-muted text-sm">{day.subtitle}</p>
      </div>

      {/* Scenario hook */}
      <div className="p-4 border border-border rounded-xl bg-surface">
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">
          {day.scenario.company} · {day.scenario.industry}
        </p>
        <p className="text-sm text-subtle leading-relaxed">{day.scenario.hook}</p>
      </div>

      {/* Cluster nav pills */}
      {day.clusters.length > 1 && (
        <div className="flex gap-2">
          {day.clusters.map((c, i) => {
            const done = clusterStates[i].phase === 'done'
            const active = i === activeCluster
            const locked = i > activeCluster
            return (
              <button
                key={c.id}
                disabled={locked}
                onClick={() => !locked && setActiveCluster(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all flex items-center justify-center gap-1 ${
                  active  ? 'border-accent bg-accent/10 text-accent' :
                  done    ? 'border-success/40 bg-success/5 text-success' :
                  locked  ? 'border-border bg-surface text-muted cursor-not-allowed' :
                            'border-border bg-surface text-muted hover:border-accent/40'
                }`}
              >
                {locked && <Lock size={10} />}
                {done && <CheckCircle size={10} />}
                <span>{c.concept.term.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Active cluster */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCluster}-${state.phase}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Phase label */}
          <PhaseHeader phase={state.phase} widgetTitle={cluster.widget.title} />

          {/* Phase content */}
          {state.phase === 'widget' && (
            <div className="space-y-3">
              <p className="text-sm text-muted">{cluster.widget.subtitle}</p>
              {renderWidget(cluster)}
            </div>
          )}

          {state.phase === 'concept' && (
            <ConceptCard
              concept={cluster.concept}
              onContinue={() => {
                if (cluster.decisionTree) setPhase(activeCluster, 'tree')
                else setPhase(activeCluster, 'quiz')
              }}
              continueLabel={cluster.decisionTree ? 'Try the scenario →' : 'Test yourself →'}
            />
          )}

          {state.phase === 'tree' && cluster.decisionTree && (
            <DecisionTree
              tree={cluster.decisionTree}
              onComplete={(xp) => {
                addXP(xp)
                setPhase(activeCluster, 'quiz')
              }}
            />
          )}

          {state.phase === 'quiz' && (
            <Quiz
              questions={cluster.quiz}
              onComplete={(xp) => {
                addXP(xp)
                setClusterStates(prev => {
                  const next = [...prev]
                  next[activeCluster] = { phase: 'done', xp: xp }
                  return next
                })
                advanceCluster()
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* XP bar */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs text-muted font-mono">{totalXP} XP</span>
        <div className="flex-1 bg-border rounded-full h-1.5">
          <motion.div
            className="bg-accent h-1.5 rounded-full"
            animate={{ width: `${Math.min(100, (totalXP / day.totalXP) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted font-mono">{day.totalXP}</span>
      </div>
    </div>
  )
}

function PhaseHeader({ phase, widgetTitle }: { phase: Phase; widgetTitle: string }) {
  const labels: Record<Phase, { tag: string; title: string; color: string }> = {
    widget:  { tag: '01', title: widgetTitle,        color: 'text-accent' },
    concept: { tag: '02', title: 'Concept',           color: 'text-warning' },
    tree:    { tag: '03', title: 'Scenario',          color: 'text-success' },
    quiz:    { tag: '04', title: 'Apply it',          color: 'text-success' },
    done:    { tag: '✓',  title: 'Complete',          color: 'text-success' },
  }
  const l = labels[phase]
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-mono font-medium ${l.color} border border-current rounded px-1.5 py-0.5`}>{l.tag}</span>
      <span className="text-sm font-medium text-text">{l.title}</span>
    </div>
  )
}
