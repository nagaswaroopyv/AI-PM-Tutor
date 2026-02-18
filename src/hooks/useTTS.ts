import { useState, useCallback, useRef } from 'react'
import type { VoiceCharacter } from '../types'
import { CHARACTERS } from '../characters'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

export function useTTS() {
  const [muted, setMuted]       = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const mutedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      console.warn('[Voice] VITE_OPENAI_API_KEY not set — narration disabled')
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setSpeaking(true)

    try {
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: CHARACTERS[character].voice,
          response_format: 'mp3',
          speed: 0.95,
        }),
      })

      if (!res.ok) throw new Error(`OpenAI TTS error ${res.status}`)
      if (mutedRef.current) { setSpeaking(false); return }

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; setSpeaking(false) }
      audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; setSpeaking(false) }

      if (!mutedRef.current) await audio.play()
    } catch (err) {
      console.error('[Voice] TTS error:', err)
      setSpeaking(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      mutedRef.current = next
      if (next && audioRef.current) { audioRef.current.pause(); setSpeaking(false) }
      return next
    })
  }, [])

  return { muted, speaking, speak, stop, toggleMute }
}
