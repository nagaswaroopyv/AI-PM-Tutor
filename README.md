# AI PM Tutor

An interactive simulator for working Product Managers building AI fluency —
and preparing to crack AI PM interviews.

## What it is

32 sessions across 10 lifecycle stages. One fictional company (SkillPath, an EdTech
upskilling platform) followed from a vague CPO brief all the way through post-launch
optimization. Every session is built around what AI PM interviewers actually ask.

Each session:
1. An interactive widget — feel the concept before it's named
2. A concept card — the mental model and what to say in a meeting
3. A scenario / decision tree — make real PM decisions with consequences
4. A quiz — apply it to a fresh industry context

## Interview coverage

| Topic | Session |
|---|---|
| Problem framing | 1.1 |
| AI vs. rules decision | 2.3 |
| GenAI fit — foundation model vs. custom | 2.4 |
| Pre-build profitability / unit economics | 3.1 |
| Responsible AI & bias | 3.3 |
| Success metrics for AI features | 4.1 |
| Target variable & model spec | 4.2 |
| RAG vs. fine-tuning vs. prompt engineering | 5.3 |
| Model tradeoffs (accuracy / speed / cost / explainability) | 6.2 |
| LLM economics | 6.3 |
| Precision, recall, F1, AUC in plain English | 7.1 |
| A/B testing AI features | 7.2 |
| Model drift & degradation | 10.2 |

## Spaced repetition

Key concepts recur across stages with increasing complexity:

- **Problem Framing** → 1.1 · 4.1 · 9.3
- **AI vs. Rules** → 2.3 · 4.2 · 6.1
- **Unit Economics** → 3.1 · 6.3 · 10.1
- **Responsible AI / Bias** → 3.3 · 5.2 · 7.4
- **Success Metrics** → 4.1 · 7.3 · 9.1
- **Precision / Recall** → 7.1 · 9.2 · 10.2

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data/           Stage content files (stage-01.ts, stage-02.ts, ...)
  components/     Shared UI (ConceptCard, DecisionTree, Quiz, StageMap, widgets/)
  engine/         SessionPlayer: renders any session from its data file
  types/          TypeScript interfaces (StageData, SessionData, etc.)
```

## Progress

- Stage 1, Session 1.1 ✅ — Problem Framing — SkillPath CPO brief
- Sessions 1.2 – 10.2 🔨 In progress
