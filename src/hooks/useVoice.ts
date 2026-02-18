import { useState, useCallback, useRef } from 'react'
import type { VoiceCharacter } from '../types'

interface VoiceProfile {
  rate: number
  pitch: number
}

const PROFILES: Record<VoiceCharacter, VoiceProfile> = {
  narrator: { rate: 0.88, pitch: 1.0  },
  priya:    { rate: 0.95, pitch: 1.12 },
  learner:  { rate: 0.92, pitch: 0.95 },
}

export function useVoice() {
  const [muted, setMuted] = useState(false)
  // Use a ref so speak() always reads the latest mute state without re-creating the callback
  const mutedRef = useRef(false)

  const speak = useCallback((text: string, character: VoiceCharacter = 'narrator') => {
    if (mutedRef.current) return
    if (!window.speechSynthesis) return

    // Cancel any in-flight utterance first
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const profile   = PROFILES[character]
    utterance.rate   = profile.rate
    utterance.pitch  = profile.pitch
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      mutedRef.current = next
      if (next) window.speechSynthesis?.cancel()
      return next
    })
  }, [])

  return { muted, speak, stop, toggleMute }
}
