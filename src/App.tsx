import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap } from 'lucide-react'
import DayPlayer from './engine/DayPlayer'
import day01 from './data/day-01'

export default function App() {
  const [globalXP, setGlobalXP] = useState(0)
  const level = Math.floor(globalXP / 200) + 1

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu size={18} className="text-accent" />
            <span className="font-mono text-sm font-medium text-text tracking-tight">AI PM Simulator</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-warning" />
              <span className="text-sm font-mono text-text">{globalXP} XP</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-mono text-accent">Lv {level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DayPlayer
            day={day01}
            onDayComplete={(xp) => setGlobalXP(prev => prev + xp)}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs text-muted text-center font-mono">
            AI PM Simulator · Day 1 of N · Built for career-switching PMs
          </p>
        </div>
      </footer>
    </div>
  )
}
