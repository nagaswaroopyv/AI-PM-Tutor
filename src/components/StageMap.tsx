import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronRight, CheckCircle, Circle } from 'lucide-react'
import type { StageData, AppProgress } from '../types'

// ─── All 10 stages in the curriculum (only stage 1 has content yet) ───────────
const STAGE_OUTLINE = [
  { stageNumber: 1, title: 'Discovery',              subtitle: 'Earn the right to the problem before you think about solutions.' },
  { stageNumber: 2, title: 'Ideation',               subtitle: 'Size the opportunity and decide what\'s worth building.' },
  { stageNumber: 3, title: 'Risk & Feasibility',     subtitle: 'What could kill this — technically, financially, legally?' },
  { stageNumber: 4, title: 'PRD',                    subtitle: 'Write it down so everyone builds the same thing you\'re imagining.' },
  { stageNumber: 5, title: 'Data Strategy',          subtitle: 'The stage that separates AI PMs from regular PMs.' },
  { stageNumber: 6, title: 'Development',            subtitle: 'You\'re the translation layer between business and the team building it.' },
  { stageNumber: 7, title: 'Evaluation & Testing',   subtitle: 'In AI, testing starts before release and never fully ends.' },
  { stageNumber: 8, title: 'Release',                subtitle: 'The moment most teams under-prepare for.' },
  { stageNumber: 9, title: 'PMF',                    subtitle: 'You\'ve shipped. Are people actually staying?' },
  { stageNumber: 10, title: 'Post-Launch',           subtitle: 'Growth comes from what you do after you ship.' },
]

interface Props {
  stages: StageData[]          // loaded stage data (currently only stage 1)
  progress: AppProgress
  onStartSession: (stageNumber: number, sessionId: string) => void
}

export default function StageMap({ stages, progress, onStartSession }: Props) {
  const [expanded, setExpanded] = useState<number | null>(1)

  const stageDataMap = Object.fromEntries(stages.map(s => [s.stageNumber, s]))
  const completedIds = new Set(progress.completedSessions.map(s => s.sessionId))

  return (
    <div className="max-w-2xl mx-auto space-y-3">

      {/* Intro */}
      <div className="mb-8 space-y-1">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">Curriculum</p>
        <h1 className="font-display text-3xl text-text">AI PM Simulator</h1>
        <p className="text-sm text-muted">
          32 sessions · 10 lifecycle stages · One company from ideation to post-launch
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span className="text-xs font-mono text-accent">SkillPath · EdTech / Upskilling</span>
        </div>
      </div>

      {/* Stage list */}
      {STAGE_OUTLINE.map((outline, idx) => {
        const stageData = stageDataMap[outline.stageNumber]
        const isBuilt = !!stageData
        const isExpanded = expanded === outline.stageNumber
        const isLocked = !isBuilt

        // session completion dots
        const totalSessions = stageData?.sessions.length ?? 3
        const completedInStage = stageData
          ? stageData.sessions.filter(s => completedIds.has(s.id)).length
          : 0

        return (
          <motion.div
            key={outline.stageNumber}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            {/* Stage row */}
            <button
              onClick={() => !isLocked && setExpanded(isExpanded ? null : outline.stageNumber)}
              disabled={isLocked}
              className={`w-full text-left p-4 bg-surface border rounded-xl transition-all flex items-center gap-4 ${
                isExpanded
                  ? 'border-accent/40 bg-accent/5'
                  : isLocked
                    ? 'border-border opacity-40 cursor-not-allowed'
                    : 'border-border hover:border-accent/30'
              }`}
            >
              {/* Stage number badge */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-sm font-medium border ${
                isExpanded
                  ? 'bg-accent text-bg border-accent'
                  : isLocked
                    ? 'bg-border/30 text-muted border-border'
                    : 'bg-surface text-muted border-border'
              }`}>
                {isLocked ? <Lock size={14} /> : outline.stageNumber}
              </div>

              {/* Stage info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text">{outline.title}</p>
                  {!isBuilt && (
                    <span className="text-xs font-mono text-muted border border-border rounded px-1.5 py-0.5">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">{outline.subtitle}</p>
              </div>

              {/* Session dots + chevron */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex gap-1">
                  {Array.from({ length: totalSessions }).map((_, i) => (
                    i < completedInStage
                      ? <div key={i} className="w-1.5 h-1.5 rounded-full bg-success" />
                      : <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
                  ))}
                </div>
                {!isLocked && (
                  <ChevronRight
                    size={16}
                    className={`text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                )}
              </div>
            </button>

            {/* Expanded: session list */}
            <AnimatePresence>
              {isExpanded && stageData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 ml-4 pl-4 border-l border-border space-y-1 pb-2">

                    {/* Scenario hook */}
                    <div className="py-3 pr-2">
                      <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                        {stageData.scenario.company} · {stageData.scenario.industry}
                      </p>
                      <p className="text-xs text-subtle leading-relaxed">{stageData.scenario.hook}</p>
                    </div>

                    {/* Sessions */}
                    {stageData.sessions.map(session => {
                      const isDone = completedIds.has(session.id)
                      return (
                        <button
                          key={session.id}
                          onClick={() => onStartSession(outline.stageNumber, session.id)}
                          className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-border bg-bg hover:border-accent/40 hover:bg-accent/5 transition-all group"
                        >
                          <span className="text-xs font-mono text-muted w-6 flex-shrink-0">
                            {session.id}
                          </span>
                          <span className="text-sm text-subtle group-hover:text-text transition-colors flex-1">
                            {session.title}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-mono text-muted">{session.totalXP} XP</span>
                            {isDone
                              ? <CheckCircle size={14} className="text-success" />
                              : <Circle size={14} className="text-muted" />
                            }
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
