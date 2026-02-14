import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Minus, ChevronRight } from 'lucide-react'
import type { DecisionTree as DTree } from '../types'

interface Props {
  tree: DTree
  onComplete: (xp: number) => void
}

export default function DecisionTree({ tree, onComplete }: Props) {
  const [path, setPath] = useState<string[]>([tree.startId])
  const [chosen, setChosen] = useState<Record<string, string>>({})   // nodeId → optionLabel
  const [consequences, setConsequences] = useState<Record<string, string>>({}) // nodeId → consequence
  const [finished, setFinished] = useState(false)
  const [outcome, setOutcome] = useState<string | null>(null)

  const currentId = path[path.length - 1]
  const currentNode = tree.nodes[currentId]
  const isEnd = currentId.startsWith('end-')

  const select = (nodeId: string, optionLabel: string, nextId: string, consequence?: string) => {
    setChosen(prev => ({ ...prev, [nodeId]: optionLabel }))
    if (consequence) setConsequences(prev => ({ ...prev, [nodeId]: consequence }))

    if (nextId.startsWith('end-')) {
      setOutcome(nextId)
      setFinished(true)
      setPath(prev => [...prev, nextId])
    } else {
      setPath(prev => [...prev, nextId])
    }
  }

  const outcomeData = outcome ? tree.outcomes[outcome] : null
  const iconMap = { good: <CheckCircle size={20} className="text-success" />, ok: <Minus size={20} className="text-warning" />, bad: <XCircle size={20} className="text-danger" /> }
  const colorMap = { good: 'border-success/40 bg-success/10', ok: 'border-warning/40 bg-warning/10', bad: 'border-danger/40 bg-danger/10' }

  return (
    <div className="space-y-4">
      {/* Breadcrumb path */}
      {path.length > 1 && (
        <div className="flex flex-wrap gap-1 items-center">
          {path.slice(0, -1).map((id, i) => (
            <React.Fragment key={id}>
              {i > 0 && <ChevronRight size={12} className="text-muted" />}
              <span className="text-xs text-muted font-mono">
                {chosen[id] ? `"${chosen[id]}"` : id}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Node history */}
      <div className="space-y-3">
        {path.slice(0, -1).map(id => {
          if (id.startsWith('end-')) return null
          const node = tree.nodes[id]
          if (!node) return null
          return (
            <div key={id} className="opacity-50 p-4 bg-surface border border-border rounded-xl">
              <p className="text-sm text-text mb-2">{node.question}</p>
              <div className="flex items-center gap-2">
                <ChevronRight size={14} className="text-accent" />
                <span className="text-sm text-accent">{chosen[id]}</span>
              </div>
              {consequences[id] && (
                <p className="text-xs text-muted mt-2 italic">{consequences[id]}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Current node */}
      <AnimatePresence mode="wait">
        {!finished && currentNode && (
          <motion.div
            key={currentId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-5 bg-surface border border-accent/30 rounded-xl space-y-4"
          >
            <p className="text-sm text-text leading-relaxed font-medium">{currentNode.question}</p>
            {currentNode.hint && (
              <p className="text-xs text-muted italic border-l-2 border-muted/30 pl-3">{currentNode.hint}</p>
            )}
            <div className="space-y-2">
              {currentNode.options.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => select(currentId, opt.label, opt.nextId, opt.consequence)}
                  className="w-full text-left p-3 rounded-xl border border-border bg-bg hover:border-accent/60 hover:bg-accent/5 transition-all text-sm text-subtle"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Outcome */}
        {finished && outcomeData && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-xl border ${colorMap[outcomeData.type]} space-y-3`}
          >
            <div className="flex items-center gap-3">
              {iconMap[outcomeData.type]}
              <span className="font-display text-lg text-text">{outcomeData.title}</span>
              <span className="ml-auto text-xs font-mono text-muted">+{outcomeData.xp} XP</span>
            </div>
            <p className="text-sm text-subtle leading-relaxed">{outcomeData.explanation}</p>
            <button
              onClick={() => onComplete(outcomeData.xp)}
              className="w-full py-2.5 bg-accent text-bg rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
            >
              Continue to quiz →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
