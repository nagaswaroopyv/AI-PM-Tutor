import React, { createContext, useContext } from 'react'
import { useVoice } from '../hooks/useVoice'
import type { VoiceCharacter } from '../types'

interface VoiceContextValue {
  muted: boolean
  speak: (text: string, character?: VoiceCharacter) => void
  stop: () => void
  toggleMute: () => void
}

const VoiceContext = createContext<VoiceContextValue | null>(null)

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const voice = useVoice()
  return <VoiceContext.Provider value={voice}>{children}</VoiceContext.Provider>
}

export function useVoiceContext() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error('useVoiceContext must be inside VoiceProvider')
  return ctx
}
