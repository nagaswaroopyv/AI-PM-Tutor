import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Zap } from 'lucide-react'
import StageMap from './components/StageMap'
import SessionPlayer from './engine/SessionPlayer'
import VoiceToggle from './components/VoiceToggle'
import { VoiceProvider } from './context/VoiceContext'
import stage01 from './data/stage-01'
import type { AppProgress } from './types'

// ─── All loaded stage data ────────────────────────────────────────────────────
const STAGES = [stage01]

// ─── View state ───────────────────────────────────────────────────────────────
type View =
  | { type: 'home' }
  | { type: 'session'; stageNumber: number; sessionId: string }

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' })
  const [progress, setProgress] = useState<AppProgress>({
    completedSessions: [],
    totalXP: 0,
  })

  const level = Math.floor(progress.totalXP / 300) + 1

  // ─── Navigation helpers ──────────────────────────────────────────────────
  const goToSession = (stageNumber: number, sessionId: string) => {
    setView({ type: 'session', stageNumber, sessionId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setView({ type: 'home' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSessionComplete = (xpEarned: number, sessionId: string) => {
    setProgress(prev => {
      const alreadyDone = prev.completedSessions.some(s => s.sessionId === sessionId)
      return {
        totalXP: alreadyDone ? prev.totalXP : prev.totalXP + xpEarned,
        completedSessions: alreadyDone
          ? prev.completedSessions
          : [...prev.completedSessions, { sessionId, xpEarned, completedAt: new Date().toISOString() }],
      }
    })
    goHome()
  }

  // ─── Resolve active session data ─────────────────────────────────────────
  const activeSessionData = (() => {
    if (view.type !== 'session') return null
    const stage = STAGES.find(s => s.stageNumber === view.stageNumber)
    if (!stage) return null
    const session = stage.sessions.find(s => s.id === view.sessionId)
    return session ? { session, stageTitle: `Stage ${view.stageNumber}: ${stage.title}` } : null
  })()

  return (
    <VoiceProvider>
    <div className="min-h-screen bg-bg text-text">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <BookOpen size={18} className="text-accent" />
            <span className="font-mono text-sm font-medium text-text tracking-tight">AI PM Simulator</span>
          </button>

          <div className="flex items-center gap-4">
            <VoiceToggle />
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-warning" />
              <span className="text-sm font-mono text-text">{progress.totalXP} XP</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-mono text-accent">Lv {level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {view.type === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StageMap
                stages={STAGES}
                progress={progress}
                onStartSession={goToSession}
              />
            </motion.div>
          )}

          {view.type === 'session' && activeSessionData && (
            <motion.div
              key={`session-${view.sessionId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SessionPlayer
                session={activeSessionData.session}
                stageTitle={activeSessionData.stageTitle}
                onBack={goHome}
                onComplete={(xp) => handleSessionComplete(xp, view.sessionId)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs text-muted text-center font-mono">
            AI PM Simulator · 10 stages · 32 sessions · Built for working PMs improving AI fluency
          </p>
        </div>
      </footer>
    </div>
    </VoiceProvider>
  )
}
