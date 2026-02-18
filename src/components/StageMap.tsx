import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronRight, CheckCircle, Circle, RotateCcw } from 'lucide-react'
import type { StageData, AppProgress } from '../types'

// ─── Full 32-session curriculum ───────────────────────────────────────────────
// Spaced repetition markers show when a concept returns in a new context:
//   ↩ = revisits an earlier concept with more complexity

const STAGE_OUTLINE: {
  stageNumber: number
  title: string
  subtitle: string
  interviewWeight: 'core' | 'high' | 'medium'
  sessions: { title: string; spaced?: string }[]
}[] = [
  {
    stageNumber: 1,
    title: 'Discovery',
    subtitle: 'Earn the right to the problem before you think about solutions.',
    interviewWeight: 'core',
    sessions: [
      { title: 'Problem Framing' },
      { title: 'User Pain Mapping' },
      { title: 'Stakeholder Alignment' },
    ],
  },
  {
    stageNumber: 2,
    title: 'Ideation',
    subtitle: 'Size the opportunity and decide what is worth building.',
    interviewWeight: 'high',
    sessions: [
      { title: 'Market Sizing' },
      { title: 'Opportunity Scoring' },
      { title: 'AI vs. Rules vs. No-Build', spaced: 'Revisits Problem Framing — now with solution options' },
      { title: 'GenAI Fit — Foundation Model or Custom?' },
    ],
  },
  {
    stageNumber: 3,
    title: 'Risk & Feasibility',
    subtitle: 'What could kill this — technically, financially, legally?',
    interviewWeight: 'core',
    sessions: [
      { title: 'Pre-Build Profitability' },
      { title: 'Technical Feasibility & Build vs. Buy' },
      { title: 'Responsible AI & Bias Risk' },
      { title: 'Risk Matrix & Go / No-Go' },
    ],
  },
  {
    stageNumber: 4,
    title: 'PRD',
    subtitle: 'Write it down so everyone builds the same thing you are imagining.',
    interviewWeight: 'core',
    sessions: [
      { title: 'Success Metrics for AI Features', spaced: 'Revisits Problem Framing — definition IS the metric' },
      { title: 'Target Variable & Model Spec', spaced: 'Revisits AI vs. Rules — is ML still the right call?' },
      { title: 'MVP Scoping for AI' },
      { title: 'Acceptance Criteria for AI Features' },
    ],
  },
  {
    stageNumber: 5,
    title: 'Data Strategy',
    subtitle: 'The stage that separates AI PMs from regular PMs.',
    interviewWeight: 'high',
    sessions: [
      { title: 'Data Sourcing & Quality' },
      { title: 'Feature Selection & Proxy Risk', spaced: 'Revisits Responsible AI — bias lives in features' },
      { title: 'RAG vs. Fine-Tuning vs. Prompt Engineering' },
    ],
  },
  {
    stageNumber: 6,
    title: 'Development',
    subtitle: 'You are the translation layer between business and the team building it.',
    interviewWeight: 'medium',
    sessions: [
      { title: 'PM-to-DS Translation', spaced: 'Revisits AI vs. Rules — validate the ML assumption' },
      { title: 'Model Tradeoffs — Accuracy, Speed, Cost, Explainability' },
      { title: 'LLM Economics — Token Cost, Latency, ROI', spaced: 'Revisits Pre-Build Profitability' },
    ],
  },
  {
    stageNumber: 7,
    title: 'Evaluation & Testing',
    subtitle: 'In AI, testing starts before release and never fully ends.',
    interviewWeight: 'core',
    sessions: [
      { title: 'Offline Metrics in Plain English — Precision, Recall, F1, AUC' },
      { title: 'A/B Test Design for AI Features' },
      { title: 'Reading Results — Significance, Effect Size, Guardrails', spaced: 'Revisits Success Metrics — measuring what you defined?' },
      { title: 'AI-Specific Testing — Shadow Mode, Canary, Bias Audit', spaced: 'Revisits Responsible AI + Feature Selection' },
    ],
  },
  {
    stageNumber: 8,
    title: 'Release',
    subtitle: 'The moment most teams under-prepare for.',
    interviewWeight: 'medium',
    sessions: [
      { title: 'Rollout Strategy — Flags, Phased, Fallback' },
      { title: 'GTM for AI — Trust, Expectations, When It Is Wrong' },
    ],
  },
  {
    stageNumber: 9,
    title: 'PMF',
    subtitle: 'You have shipped. Are people actually staying?',
    interviewWeight: 'high',
    sessions: [
      { title: 'PMF Signals for AI Products', spaced: 'Revisits Success Metrics — are these the right ones?' },
      { title: 'Cohort & Retention Analysis' },
      { title: 'Pivot vs. Persist', spaced: 'Revisits Problem Framing — was the original framing right?' },
    ],
  },
  {
    stageNumber: 10,
    title: 'Post-Launch',
    subtitle: 'Growth comes from what you do after you ship.',
    interviewWeight: 'core',
    sessions: [
      { title: 'Post-Launch Profitability', spaced: 'Revisits Pre-Build Profitability + LLM Economics' },
      { title: 'Model Drift & Degradation — Detect, Diagnose, Retrain', spaced: 'Revisits Offline Metrics — which metric is decaying?' },
    ],
  },
]

// ─── Interview weight config ──────────────────────────────────────────────────
const WEIGHT_CONFIG = {
  core:   { label: 'Core interview topic', color: 'text-danger',  bg: 'bg-danger/10',  border: 'border-danger/30'  },
  high:   { label: 'Frequently asked',     color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  medium: { label: 'Good to know',         color: 'text-muted',   bg: 'bg-surface',    border: 'border-border'     },
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  stages: StageData[]
  progress: AppProgress
  onStartSession: (stageNumber: number, sessionId: string) => void
}

export default function StageMap({ stages, progress, onStartSession }: Props) {
  const [expanded, setExpanded] = useState<number | null>(1)

  const stageDataMap = Object.fromEntries(stages.map(s => [s.stageNumber, s]))
  const completedIds = new Set(progress.completedSessions.map(s => s.sessionId))

  const totalSessions = STAGE_OUTLINE.reduce((sum, s) => sum + s.sessions.length, 0)
  const completedCount = progress.completedSessions.length

  return (
    <div className="max-w-2xl mx-auto space-y-2">

      {/* Header */}
      <div className="mb-8 space-y-3">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">Curriculum</p>
        <h1 className="font-display text-3xl text-text">AI PM Tutor</h1>
        <p className="text-sm text-muted leading-relaxed">
          32 sessions across 10 lifecycle stages. One company — SkillPath — from
          a vague brief to a shipped AI product. Built around what interviewers actually ask.
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-xs font-mono text-muted">{completedCount} of {totalSessions} sessions</span>
            <span className="text-xs font-mono text-accent">{progress.totalXP} XP</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <motion.div
              className="bg-accent h-1.5 rounded-full"
              animate={{ width: `${(completedCount / totalSessions) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(WEIGHT_CONFIG).map(([key, cfg]) => (
            <span
              key={key}
              className={`text-xs font-mono px-2 py-0.5 rounded border ${cfg.color} ${cfg.bg} ${cfg.border}`}
            >
              {cfg.label}
            </span>
          ))}
          <span className="text-xs font-mono px-2 py-0.5 rounded border border-accent/30 text-accent bg-accent/5 flex items-center gap-1">
            <RotateCcw size={10} /> Spaced repetition
          </span>
        </div>
      </div>

      {/* Stage list */}
      {STAGE_OUTLINE.map((outline, idx) => {
        const stageData = stageDataMap[outline.stageNumber]
        const isBuilt   = !!stageData
        const isExpanded = expanded === outline.stageNumber
        const wCfg = WEIGHT_CONFIG[outline.interviewWeight]

        const completedInStage = stageData
          ? stageData.sessions.filter(s => completedIds.has(s.id)).length
          : 0
        const totalInStage = outline.sessions.length

        return (
          <motion.div
            key={outline.stageNumber}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            {/* Stage header row */}
            <button
              onClick={() => setExpanded(isExpanded ? null : outline.stageNumber)}
              className={`w-full text-left p-4 bg-surface border rounded-xl transition-all flex items-center gap-3 ${
                isExpanded ? 'border-accent/40 bg-accent/5 rounded-b-none' : 'border-border hover:border-accent/30'
              }`}
            >
              {/* Stage number */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold border transition-colors ${
                isExpanded
                  ? 'bg-accent text-bg border-accent'
                  : 'bg-bg text-muted border-border'
              }`}>
                {outline.stageNumber}
              </div>

              {/* Stage info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text">{outline.title}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${wCfg.color} ${wCfg.bg} ${wCfg.border}`}>
                    {wCfg.label}
                  </span>
                  {!isBuilt && (
                    <span className="flex items-center gap-1 text-xs font-mono text-muted border border-border rounded px-1.5 py-0.5">
                      <Lock size={9} /> Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">{outline.subtitle}</p>
              </div>

              {/* Session dots + chevron */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="flex gap-1">
                  {outline.sessions.map((_, i) => {
                    const sessionId = `${outline.stageNumber}.${i + 1}`
                    const done = completedIds.has(sessionId)
                    return done
                      ? <div key={i} className="w-1.5 h-1.5 rounded-full bg-success" />
                      : <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
                  })}
                </div>
                <ChevronRight
                  size={15}
                  className={`text-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {/* Expanded: session list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden border border-t-0 border-accent/20 rounded-b-xl bg-bg"
                >
                  <div className="px-4 pb-4 pt-3 space-y-1">

                    {/* Scenario hook (only for built stages) */}
                    {stageData && (
                      <div className="pb-3 border-b border-border mb-3">
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                          {stageData.scenario.company} · {stageData.scenario.industry}
                        </p>
                        <p className="text-xs text-subtle leading-relaxed">{stageData.scenario.hook}</p>
                      </div>
                    )}

                    {/* Sessions */}
                    {outline.sessions.map((session, i) => {
                      const sessionId = `${outline.stageNumber}.${i + 1}`
                      const isDone    = completedIds.has(sessionId)
                      const builtSession = stageData?.sessions.find(s => s.id === sessionId)
                      const isPlayable  = !!builtSession

                      return (
                        <div
                          key={sessionId}
                          onClick={() => isPlayable && onStartSession(outline.stageNumber, sessionId)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all group ${
                            isPlayable
                              ? 'border-border bg-surface hover:border-accent/40 hover:bg-accent/5 cursor-pointer'
                              : 'border-border/50 bg-surface/50 opacity-60 cursor-default'
                          }`}
                        >
                          {/* Session ID */}
                          <span className="text-xs font-mono text-muted w-6 flex-shrink-0 mt-0.5">
                            {sessionId}
                          </span>

                          {/* Session title + spaced repetition tag */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm transition-colors ${
                              isPlayable ? 'text-subtle group-hover:text-text' : 'text-muted'
                            }`}>
                              {session.title}
                            </p>
                            {session.spaced && (
                              <p className="text-xs text-accent/70 mt-0.5 flex items-center gap-1">
                                <RotateCcw size={9} />
                                {session.spaced}
                              </p>
                            )}
                          </div>

                          {/* XP + status */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {builtSession && (
                              <span className="text-xs font-mono text-muted">
                                {builtSession.totalXP} XP
                              </span>
                            )}
                            {!isPlayable
                              ? <Lock size={12} className="text-muted/40" />
                              : isDone
                                ? <CheckCircle size={14} className="text-success" />
                                : <Circle size={14} className="text-muted" />
                            }
                          </div>
                        </div>
                      )
                    })}

                    {/* Stage completion summary */}
                    {isBuilt && (
                      <p className="text-xs text-muted font-mono pt-1 text-right">
                        {completedInStage} / {totalInStage} completed
                      </p>
                    )}
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
