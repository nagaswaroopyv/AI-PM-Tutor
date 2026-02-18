import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useVoiceContext } from '../context/VoiceContext'

export default function VoiceToggle() {
  const { muted, toggleMute } = useVoiceContext()

  return (
    <button
      onClick={toggleMute}
      title={muted ? 'Unmute narrator' : 'Mute narrator'}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all border ${
        muted
          ? 'border-border text-muted hover:text-text hover:border-accent/40'
          : 'border-accent/30 text-accent hover:bg-accent/10'
      }`}
    >
      {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
    </button>
  )
}
