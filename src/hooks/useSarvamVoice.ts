import { useState, useCallback, useRef } from 'react'
import type { VoiceCharacter } from '../types'
import { CHARACTERS } from '../characters'

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY as string | undefined

export function useSarvamVoice() {
  const [muted, setMuted]       = useState(false)
  const [speaking, setSpeaking] = useState(false)

  // Refs so callbacks always read latest state without stale closures
  const mutedRef   = useRef(false)
  const audioRef   = useRef<HTMLAudioElement | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setSpeaking(false)
  }, [])

  const speak = useCallback(async (text: string, character: VoiceCharacter = 'narrator') => {
    if (mutedRef.current) return

    if (!API_KEY) {
      console.warn('[Voice] VITE_SARVAM_API_KEY not set — narration disabled')
      return
    }

    // Cancel whatever is playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setSpeaking(true)

    try {
      const res = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          target_language_code: 'en-IN',
          model: 'bulbul:v3',
          speaker: CHARACTERS[character].speaker,
          speech_sample_rate: 22050,
          output_audio_codec: 'wav',
        }),
      })

      if (!res.ok) throw new Error(`Sarvam API error ${res.status}`)

      const json = await res.json() as { audios: string[] }
      const base64 = json.audios?.[0]
      if (!base64) throw new Error('No audio returned')

      // Bail if muted while the fetch was in-flight
      if (mutedRef.current) { setSpeaking(false); return }

      const audio = new Audio(`data:audio/wav;base64,${base64}`)
      audioRef.current = audio

      audio.onended = () => {
        audioRef.current = null
        setSpeaking(false)
      }
      audio.onerror = () => {
        audioRef.current = null
        setSpeaking(false)
      }

      await audio.play()
    } catch (err) {
      console.error('[Voice] Sarvam TTS error:', err)
      setSpeaking(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      mutedRef.current = next
      if (next && audioRef.current) {
        audioRef.current.pause()
        setSpeaking(false)
      }
      return next
    })
  }, [])

  return { muted, speaking, speak, stop, toggleMute }
}
