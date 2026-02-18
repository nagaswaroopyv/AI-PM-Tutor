import type { VoiceCharacter } from './types'

export interface Character {
  id: VoiceCharacter
  name: string
  title: string
  initials: string
  // Static full class strings — must be spelled out for Tailwind JIT
  avatarClass: string  // bg + text color for the avatar circle
  barClass: string     // bg color for waveform bars
  speaker: string      // Sarvam bulbul:v3 speaker name
}

export const CHARACTERS: Record<VoiceCharacter, Character> = {
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    title: 'AI PM Simulator',
    initials: '≋',
    avatarClass: 'bg-accent/20 text-accent',
    barClass: 'bg-accent',
    speaker: 'amelia',   // bulbul:v3 — clear, neutral English
  },
  priya: {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Chief Product Officer · SkillPath',
    initials: 'PS',
    avatarClass: 'bg-warning/20 text-warning',
    barClass: 'bg-warning',
    speaker: 'priya',   // bulbul:v3 — warm female, matches character name
  },
  learner: {
    id: 'learner',
    name: 'Learner',
    title: 'Axis Corp',
    initials: '◎',
    avatarClass: 'bg-success/20 text-success',
    barClass: 'bg-success',
    speaker: 'aditya',  // bulbul:v3 — male, casual
  },
}
