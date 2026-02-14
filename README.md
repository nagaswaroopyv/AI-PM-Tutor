# AI PM Simulator

An interactive learning platform that teaches AI/ML concepts from a **Product Manager's perspective**.

## What it is

A daily 20-30 minute session simulator where you learn by doing — not by reading. Each day:
1. A live interactive widget lets you *feel* the concept before it's named
2. A short visual explanation reveals the label and mental model
3. A decision tree or simulation puts you in a real PM scenario
4. A quiz tests transfer to a fresh industry context

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

## Structure

```
src/
  data/          — Day content files (day-01.ts, day-02.ts, ...)
  components/    — Shared UI components
  engine/        — DayPlayer: renders any day from its data file
  types/         — TypeScript interfaces
```

## Progress

- Day 1 ✅ — Rules vs AI (Deterministic vs Probabilistic) — Fintech/CreditPulse scenario
- Days 2–N 🔨 To build
