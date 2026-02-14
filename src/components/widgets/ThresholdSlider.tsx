import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import type { Widget } from '../../types'

interface Props {
  widget: Widget
  onComplete: () => void
}

interface Outcome {
  threshold: [number, number]
  approvalRate: number
  defaultRate: number
  revenue: number
  label: string
  color: 'success' | 'warning' | 'danger'
}

export default function ThresholdSlider({ widget, onComplete }: Props) {
  const cfg = widget.config as {
    description: string
    sliderMin: number
    sliderMax: number
    sliderDefault: number
    sliderLabel: string
    outcomes: Outcome[]
    insight: string
  }

  const [value, setValue] = useState(cfg.sliderDefault)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [insightVisible, setInsightVisible] = useState(false)

  const currentOutcome = useMemo(() => {
    return cfg.outcomes.find(o => value >= o.threshold[0] && value <= o.threshold[1]) ?? cfg.outcomes[0]
  }, [value, cfg.outcomes])

  const colorMap = {
    success: { text: 'text-success', bg: 'bg-success/10', border: 'border-success/30', bar: '#3fb950' },
    warning: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', bar: '#d29922' },
    danger:  { text: 'text-danger',  bg: 'bg-danger/10',  border: 'border-danger/30',  bar: '#f85149' },
  }
  const c = colorMap[currentOutcome.color]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
    if (!hasInteracted) setHasInteracted(true)
    if (Number(e.target.value) !== cfg.sliderDefault) {
      setTimeout(() => setInsightVisible(true), 1500)
    }
  }

  const pct = ((value - cfg.sliderMin) / (cfg.sliderMax - cfg.sliderMin)) * 100

  return (
    <div className="space-y-6">
      {/* Context */}
      <p className="text-subtle text-sm leading-relaxed">{cfg.description}</p>

      {/* Slider */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted font-mono uppercase tracking-wider">{cfg.sliderLabel}</span>
          <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-display text-accent"
          >
            {value}
          </motion.span>
        </div>

        {/* Track */}
        <div className="relative">
          <div
            className="absolute inset-y-0 left-0 rounded-l-full transition-all duration-150"
            style={{ width: `${pct}%`, background: colorMap[currentOutcome.color].bar, opacity: 0.3 }}
          />
          <input
            type="range"
            min={cfg.sliderMin}
            max={cfg.sliderMax}
            step={10}
            value={value}
            onChange={handleChange}
            className="relative w-full"
            style={{
              background: `linear-gradient(to right, ${colorMap[currentOutcome.color].bar} 0%, ${colorMap[currentOutcome.color].bar} ${pct}%, #21262d ${pct}%, #21262d 100%)`,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">{cfg.sliderMin}</span>
            <span className="text-xs text-muted">{cfg.sliderMax}</span>
          </div>
        </div>

        {/* Label pill */}
        <div className="flex justify-center">
          <motion.span
            key={currentOutcome.label}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${c.bg} ${c.text} ${c.border}`}
          >
            {currentOutcome.label}
          </motion.span>
        </div>
      </div>

      {/* Outcome metrics */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOutcome.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <Metric
            label="Approval rate"
            value={`${currentOutcome.approvalRate}%`}
            icon={<TrendingUp size={14} />}
            good={currentOutcome.approvalRate > 50}
          />
          <Metric
            label="Default rate"
            value={`${currentOutcome.defaultRate}%`}
            icon={<AlertTriangle size={14} />}
            good={currentOutcome.defaultRate < 10}
            invert
          />
          <Metric
            label="Monthly revenue"
            value={`₹${currentOutcome.revenue}Cr`}
            icon={<TrendingUp size={14} />}
            good={currentOutcome.revenue > 4.5}
          />
        </motion.div>
      </AnimatePresence>

      {/* Insight reveal */}
      <AnimatePresence>
        {insightVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl"
          >
            <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-subtle leading-relaxed">{cfg.insight}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      {insightVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onComplete}
          className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          Got it — show me the concept →
        </motion.button>
      )}
    </div>
  )
}

function Metric({ label, value, icon, good, invert }: {
  label: string; value: string; icon: React.ReactNode; good: boolean; invert?: boolean
}) {
  const isPositive = invert ? !good : good
  return (
    <div className="bg-surface border border-border rounded-xl p-4 text-center space-y-1">
      <div className={`flex justify-center ${isPositive ? 'text-success' : 'text-danger'}`}>{icon}</div>
      <div className={`text-xl font-display ${isPositive ? 'text-success' : 'text-danger'}`}>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}
