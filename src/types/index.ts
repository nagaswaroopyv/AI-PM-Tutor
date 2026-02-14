// ─── Concept card shown after the interactive widget ───────────────────────
export interface ConceptCard {
  id: string
  term: string
  tagline: string          // one-line hook
  definition: string       // 2-3 sentences, plain English
  mentalModel: string      // the analogy (e.g. "Think of it like a vending machine")
  pmTakeaway: string       // exact phrase to use in a real meeting
  category: 'foundation' | 'data' | 'model' | 'evaluation' | 'production' | 'genai' | 'agents'
}

// ─── Interactive widget descriptor ─────────────────────────────────────────
export type WidgetType =
  | 'threshold-slider'
  | 'drag-rank'
  | 'decision-tree'
  | 'confusion-builder'
  | 'token-counter'
  | 'cost-calculator'

export interface Widget {
  type: WidgetType
  title: string
  subtitle: string
  config: Record<string, unknown>   // widget-specific config
}

// ─── Decision tree node ─────────────────────────────────────────────────────
export interface TreeNode {
  id: string
  question: string
  hint?: string
  options: {
    label: string
    nextId: string | 'end-good' | 'end-bad' | 'end-ok'
    consequence?: string   // shown after selection
  }[]
}

export interface DecisionTree {
  startId: string
  nodes: Record<string, TreeNode>
  outcomes: Record<string, {
    type: 'good' | 'ok' | 'bad'
    title: string
    explanation: string
    xp: number
  }>
}

// ─── Quiz question ───────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string
  scenario: string         // fresh industry context
  question: string
  options: {
    label: string
    correct: boolean
    explanation: string
  }[]
  xp: number
}

// ─── A single concept cluster within a day ──────────────────────────────────
export interface ConceptCluster {
  id: string
  widget: Widget
  concept: ConceptCard
  decisionTree?: DecisionTree
  quiz: QuizQuestion[]
}

// ─── Full day definition ─────────────────────────────────────────────────────
export interface DayData {
  dayNumber: number
  title: string
  subtitle: string
  scenario: {
    industry: string
    company: string
    hook: string           // 1-2 sentence situation that frames the day
  }
  clusters: ConceptCluster[]
  totalXP: number
}

// ─── Learner progress ────────────────────────────────────────────────────────
export interface DayProgress {
  dayNumber: number
  completedClusters: string[]
  xpEarned: number
  quizScores: Record<string, number>
  completedAt?: string
}
