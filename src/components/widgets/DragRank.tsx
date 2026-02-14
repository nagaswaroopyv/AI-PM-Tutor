import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, CheckCircle, XCircle, Info } from 'lucide-react'
import type { Widget } from '../../types'

interface Props {
  widget: Widget
  onComplete: () => void
}

interface DragItem {
  id: string
  label: string
  hint: string
}

export default function DragRank({ widget, onComplete }: Props) {
  const cfg = widget.config as {
    context: string
    mode?: 'rank' | 'two-bucket'
    items: DragItem[]
    buckets?: { id: string; label: string; color: string; description: string }[]
    correctOrder?: string[]
    correctBuckets?: Record<string, string[]>
    explanations: Record<string, string>
  }

  const isBucket = cfg.mode === 'two-bucket'

  // ── Ranking mode state ──────────────────────────────────────────────────
  const [items, setItems] = useState<DragItem[]>(cfg.items)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // ── Bucket mode state ───────────────────────────────────────────────────
  const [buckets, setBuckets] = useState<Record<string, DragItem[]>>(() => {
    const init: Record<string, DragItem[]> = { unassigned: [...cfg.items] }
    cfg.buckets?.forEach(b => { init[b.id] = [] })
    return init
  })
  const [dragging, setDragging] = useState<{ item: DragItem; from: string } | null>(null)
  const [dragOverBucket, setDragOverBucket] = useState<string | null>(null)

  const [submitted, setSubmitted] = useState(false)
  const [scores, setScores] = useState<Record<string, boolean>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Rank drag handlers ──────────────────────────────────────────────────
  const handleRankDragStart = (id: string) => setDragId(id)
  const handleRankDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setOverId(id) }
  const handleRankDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setOverId(null); return }
    const arr = [...items]
    const from = arr.findIndex(i => i.id === dragId)
    const to = arr.findIndex(i => i.id === targetId)
    arr.splice(to, 0, arr.splice(from, 1)[0])
    setItems(arr)
    setDragId(null)
    setOverId(null)
  }

  // ── Bucket drag handlers ────────────────────────────────────────────────
  const startBucketDrag = (item: DragItem, from: string) => setDragging({ item, from })
  const dropIntoBucket = (bucketId: string) => {
    if (!dragging) return
    const { item, from } = dragging
    if (from === bucketId) { setDragging(null); setDragOverBucket(null); return }
    setBuckets(prev => {
      const next = { ...prev }
      next[from] = prev[from].filter(i => i.id !== item.id)
      next[bucketId] = [...(prev[bucketId] || []), item]
      return next
    })
    setDragging(null)
    setDragOverBucket(null)
  }

  // ── Submit & score ──────────────────────────────────────────────────────
  const handleSubmit = () => {
    const result: Record<string, boolean> = {}
    if (isBucket && cfg.correctBuckets) {
      Object.entries(cfg.correctBuckets).forEach(([bucketId, correctIds]) => {
        const actual = buckets[bucketId]?.map(i => i.id) ?? []
        correctIds.forEach(id => { result[id] = actual.includes(id) })
      })
      // items left in unassigned are wrong
      buckets['unassigned']?.forEach(i => { result[i.id] = false })
    } else if (cfg.correctOrder) {
      const order = items.map(i => i.id)
      cfg.correctOrder.forEach((id, idx) => { result[id] = order[idx] === id })
    }
    setScores(result)
    setSubmitted(true)
  }

  const correctCount = Object.values(scores).filter(Boolean).length
  const total = cfg.items.length
  const allAssigned = !isBucket || buckets['unassigned']?.length === 0

  return (
    <div className="space-y-5">
      <p className="text-subtle text-sm leading-relaxed">{cfg.context}</p>

      {/* ── BUCKET MODE ───────────────────────────────────────────────── */}
      {isBucket ? (
        <div className="space-y-4">
          {/* Unassigned pool */}
          {!submitted && buckets['unassigned']?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted uppercase tracking-wider font-mono">Drag each feature into a bucket</p>
              <div className="flex flex-wrap gap-2">
                {buckets['unassigned'].map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    draggable
                    onDragStart={() => startBucketDrag(item, 'unassigned')}
                    onDragEnd={() => setDragging(null)}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm cursor-grab active:cursor-grabbing flex items-center gap-2 hover:border-accent/50 transition-colors"
                  >
                    <GripVertical size={12} className="text-muted" />
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Buckets */}
          <div className="grid grid-cols-2 gap-4">
            {cfg.buckets?.map(bucket => {
              const colorMap: Record<string, string> = {
                success: 'border-success/40 bg-success/5',
                danger:  'border-danger/40 bg-danger/5',
                warning: 'border-warning/40 bg-warning/5',
                accent:  'border-accent/40 bg-accent/5',
              }
              const overClass = dragOverBucket === bucket.id ? 'ring-2 ring-accent' : ''
              return (
                <div
                  key={bucket.id}
                  onDragOver={e => { e.preventDefault(); setDragOverBucket(bucket.id) }}
                  onDragLeave={() => setDragOverBucket(null)}
                  onDrop={() => dropIntoBucket(bucket.id)}
                  className={`rounded-xl border-2 border-dashed p-3 min-h-[120px] transition-all ${colorMap[bucket.color]} ${overClass}`}
                >
                  <p className="text-xs font-mono font-medium mb-2 text-muted uppercase">{bucket.label}</p>
                  <p className="text-xs text-muted mb-3 opacity-70">{bucket.description}</p>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {buckets[bucket.id]?.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          draggable={!submitted}
                          onDragStart={() => startBucketDrag(item, bucket.id)}
                          onDragEnd={() => setDragging(null)}
                          className={`px-3 py-2 rounded-lg text-xs cursor-grab flex items-center justify-between gap-2 ${
                            submitted
                              ? scores[item.id]
                                ? 'bg-success/20 border border-success/40'
                                : 'bg-danger/20 border border-danger/40'
                              : 'bg-bg border border-border hover:border-accent/50'
                          } transition-colors`}
                        >
                          <span>{item.label}</span>
                          {submitted && (
                            <button
                              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                              className="flex-shrink-0 opacity-70 hover:opacity-100"
                            >
                              <Info size={12} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Explanations */}
          {submitted && (
            <div className="space-y-2 mt-2">
              <p className="text-xs text-muted uppercase tracking-wider font-mono">Explanations</p>
              {cfg.items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-xl text-sm leading-relaxed ${
                    scores[item.id]
                      ? 'bg-success/10 border border-success/30'
                      : 'bg-danger/10 border border-danger/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {scores[item.id]
                      ? <CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" />
                      : <XCircle size={14} className="text-danger flex-shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="text-sm font-medium text-text">{item.label}</p>
                      <p className="text-sm text-subtle mt-1">{cfg.explanations[item.id]}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ── RANK MODE ──────────────────────────────────────────────────
        <div className="space-y-2">
          {!submitted ? (
            <>
              <p className="text-xs text-muted uppercase tracking-wider font-mono mb-3">Drag to reorder — most useful at top</p>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  draggable
                  onDragStart={() => handleRankDragStart(item.id)}
                  onDragOver={e => handleRankDragOver(e, item.id)}
                  onDrop={() => handleRankDrop(item.id)}
                  onDragEnd={() => { setDragId(null); setOverId(null) }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    dragId === item.id ? 'opacity-40' : ''
                  } ${overId === item.id ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}
                >
                  <GripVertical size={16} className="text-muted flex-shrink-0" />
                  <span className="text-xs text-muted font-mono w-5">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            <>
              <p className="text-xs text-muted uppercase tracking-wider font-mono mb-3">Correct order</p>
              {(cfg.correctOrder ?? []).map((id, idx) => {
                const item = cfg.items.find(i => i.id === id)
                if (!item) return null
                const userIdx = items.findIndex(i => i.id === id)
                const isCorrect = scores[id]
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border transition-all ${
                      isCorrect
                        ? 'border-success/50 bg-success/5'
                        : 'border-danger/50 bg-danger/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-muted mt-1 w-5 flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-text">{item.label}</p>
                          {isCorrect
                            ? <CheckCircle size={14} className="text-success flex-shrink-0" />
                            : <XCircle size={14} className="text-danger flex-shrink-0" />
                          }
                        </div>
                        {!isCorrect && (
                          <p className="text-xs text-muted mt-1">You ranked this #{userIdx + 1}</p>
                        )}
                        <p className="text-sm text-subtle mt-2 leading-relaxed">{cfg.explanations[id]}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* Submit / score / continue */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            allAssigned
              ? 'bg-accent text-bg hover:bg-accent/90'
              : 'bg-surface text-muted border border-border cursor-not-allowed'
          }`}
        >
          {allAssigned ? 'Check my answer →' : `Assign all ${buckets['unassigned']?.length ?? 0} remaining features first`}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
            <span className="text-sm text-muted">Score</span>
            <span className={`text-xl font-display ${correctCount === total ? 'text-success' : correctCount > total / 2 ? 'text-warning' : 'text-danger'}`}>
              {correctCount} / {total}
            </span>
          </div>
          {isBucket && (
            <p className="text-xs text-muted text-center">Tap the ⓘ icon on any feature to read the explanation</p>
          )}
          <button
            onClick={onComplete}
            className="w-full py-3 bg-accent text-bg font-medium rounded-xl hover:bg-accent/90 transition-colors"
          >
            Got it — show me the concept →
          </button>
        </div>
      )}
    </div>
  )
}
