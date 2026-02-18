// ─── Concept card shown after the interactive widget ───────────────────────
export interface ConceptCard {
  id: string
  term: string
  tagline: string
  definition: string
  mentalModel: string
  pmTakeaway: string
  category:
    | 'discovery'
    | 'ideation'
    | 'risk'
    | 'prd'
    | 'data'
    | 'development'
    | 'evaluation'
    | 'release'
    | 'pmf'
    | 'optimization'
}

// ─── Widget types ────────────────────────────────────────────────────────────
export type WidgetType =
  | 'brief-classifier'
  | 'threshold-slider'
  | 'drag-rank'
  | 'unit-economics'
  | 'ab-test-designer'
  | 'confusion-builder'
  | 'cost-calculator'

export interface Widget {
  type: WidgetType
  title: string
  subtitle: string
  config: Record<string, unknown>
}

// ─── Decision tree ────────────────────────────────────────────────────────────
export interface TreeNode {
  id: string
  question: string
  hint?: string
  options: {
    label: string
    nextId: string
    consequence?: string
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

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string
  scenario: string
  question: string
  options: {
    label: string
    correct: boolean
    explanation: string
  }[]
  xp: number
}

// ─── Session (a single ~20-min learning session) ──────────────────────────────
export interface SessionData {
  id: string           // e.g. "1.1", "2.3"
  title: string
  totalXP: number
  widget: Widget
  concept: ConceptCard
  decisionTree?: DecisionTree
  quiz: QuizQuestion[]
}

// ─── Stage (a lifecycle phase containing sessions) ────────────────────────────
export interface StageData {
  stageNumber: number
  title: string
  subtitle: string
  scenario: {
    company: string
    industry: string
    hook: string
  }
  sessions: SessionData[]
}

// ─── Progress tracking ────────────────────────────────────────────────────────
export interface SessionProgress {
  sessionId: string
  xpEarned: number
  completedAt?: string
}

export interface AppProgress {
  completedSessions: SessionProgress[]
  totalXP: number
}
