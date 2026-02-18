import type { VoiceCharacter } from './types'

export interface Character {
  id: VoiceCharacter
  name: string
  title: string
  initials: string
  // Static full class strings — must be spelled out for Tailwind JIT
  avatarClass: string  // bg + text color for the avatar circle
  barClass: string     // bg color for waveform bars
  voice: string        // OpenAI TTS voice name
}

export const CHARACTERS: Record<VoiceCharacter, Character> = {
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    title: 'AI PM Simulator',
    initials: '≋',
    avatarClass: 'bg-accent/20 text-accent',
    barClass: 'bg-accent',
    voice: 'nova',      // clear, engaged female narrator
  },
  priya: {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Chief Product Officer · SkillPath',
    initials: 'PS',
    avatarClass: 'bg-warning/20 text-warning',
    barClass: 'bg-warning',
    voice: 'shimmer',   // warm, confident female
  },
  learner: {
    id: 'learner',
    name: 'Learner',
    title: 'Axis Corp',
    initials: '◎',
    avatarClass: 'bg-success/20 text-success',
    barClass: 'bg-success',
    voice: 'echo',      // calm, casual male
  },
}
