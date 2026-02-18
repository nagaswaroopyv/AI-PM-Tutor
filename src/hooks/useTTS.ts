import { useState, useCallback, useRef } from 'react'
import type { VoiceCharacter } from '../types'
import { CHARACTERS } from '../characters'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

export interface PlaybackInfo {
  token: number      // increments on each new utterance — used as effect trigger
  msPerWord: number  // typewriter speed derived from actual audio duration
}

export function useTTS() {
  const [muted, setMuted]               = useState(false)
  const [speaking, setSpeaking]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [playbackInfo, setPlaybackInfo] = useState<PlaybackInfo | null>(null)

  const mutedRef     = useRef(false)
  const audioRef     = useRef<HTMLAudioElement | null>(null)
  const msPerWordRef = useRef(320)  // ~187 WPM fallback if metadata unavailable

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setSpeaking(false)
    setLoading(false)
  }, [])

  const speak = useCallback(async (text: string, character: VoiceCharacter = 'narrator') => {
    if (mutedRef.current) return

    const wordCount = text.trim().split(/\s+/).length

    // Cancel whatever is playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setSpeaking(false)

    // No API key — trigger typewriter at fallback speed immediately
    if (!API_KEY) {
      console.warn('[Voice] VITE_OPENAI_API_KEY not set')
      setPlaybackInfo({ token: Date.now(), msPerWord: 280 })
      return
    }

    setLoading(true)
    setPlaybackInfo(null)  // clear previous so panel shows loading state

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

      if (!res.ok) throw new Error(`OpenAI TTS ${res.status}`)
      if (mutedRef.current) { setLoading(false); return }

      const blob  = await res.blob()
      const url   = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      // When metadata loads we know the exact duration — calculate sync speed
      audio.onloadedmetadata = () => {
        if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
          msPerWordRef.current = (audio.duration * 1000) / wordCount
        }
      }

      // Typewriter fires exactly when audio starts playing
      audio.onplay = () => {
        setLoading(false)
        setSpeaking(true)
        setPlaybackInfo({ token: Date.now(), msPerWord: msPerWordRef.current })
      }

      audio.onended = () => {
        URL.revokeObjectURL(url)
        audioRef.current = null
        setSpeaking(false)
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        audioRef.current = null
        setSpeaking(false)
        setLoading(false)
        // Fallback: still show text
        setPlaybackInfo({ token: Date.now(), msPerWord: 280 })
      }

      if (!mutedRef.current) await audio.play()
    } catch (err) {
      console.error('[Voice] TTS error:', err)
      setLoading(false)
      setSpeaking(false)
      setPlaybackInfo({ token: Date.now(), msPerWord: 280 })
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

  return { muted, speaking, loading, playbackInfo, speak, stop, toggleMute }
}
