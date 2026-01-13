import { createContext, useContext, useRef, useState } from 'react';

import departure from '../assets/sounds/departure.mp3';
import refuse from '../assets/sounds/refuse.mp3';
import station from '../assets/sounds/train-station.mp3';
import whistle from '../assets/sounds/whistle.mp3';

type Track = 'home' | 'boarding' | 'departure' | 'refuse';

const AudioCtx = createContext<any>(null);

export function AudioProvider({ children }: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const currentTrack = useRef<Track | null>(null);

  const tracks: Record<Track, string> = {
    home: station,
    boarding: whistle,
    departure: departure,
    refuse: refuse,
  };

  const play = async (track: Track) => {
    if (!enabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[track]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    if (currentTrack.current !== track) {
      fadeOut(() => {
        audioRef.current!.src = tracks[track];
        audioRef.current!.play();
        fadeIn();
        currentTrack.current = track;
      });
    }
  };

  const fadeIn = () => {
    let v = 0;
    const id = setInterval(() => {
      if (!audioRef.current) return;
      v += 0.05;
      audioRef.current.volume = Math.min(v, 0.5);
      if (v >= 0.5) clearInterval(id);
    }, 60);
  };

  const fadeOut = (done: () => void) => {
    let v = audioRef.current?.volume || 0;
    const id = setInterval(() => {
      if (!audioRef.current) return;
      v -= 0.05;
      audioRef.current.volume = Math.max(v, 0);
      if (v <= 0) {
        clearInterval(id);
        done();
      }
    }, 60);
  };

  const stop = () => {
    audioRef.current?.pause();
    currentTrack.current = null;
  };

  return (
    <AudioCtx.Provider value={{ play, stop, enabled, setEnabled }}>{children}</AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
