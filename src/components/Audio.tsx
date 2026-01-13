import { createContext, useContext, useRef, useState } from 'react';

import ambient from '../assets/sounds/bgSound.mp3';
import departure from '../assets/sounds/departure.mp3';
import gate from '../assets/sounds/gate-open.mp3';
import refuse from '../assets/sounds/refuse.mp3';
import horn from '../assets/sounds/train-horn.mp3';
import station from '../assets/sounds/train-station.mp3';
import whistle from '../assets/sounds/whistle.mp3';
import whoosh from '../assets/sounds/whoosh.mp3';

type Track = 'home' | 'boarding' | 'departure' | 'refuse' | 'horn' | 'gate' | 'whoosh';

const AudioCtx = createContext<any>(null);

export function AudioProvider({ children }: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = useRef<Track | null>(null);

  const [enabled, setEnabled] = useState(true);

  const tracks: Record<Track, string> = {
    home: station,
    boarding: whistle,
    departure: departure,
    refuse: refuse,
    horn: horn,
    gate: gate,
    whoosh: whoosh,
  };

  const startBackground = () => {
    if (!enabled) return;

    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio(ambient);
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.2;
      bgAudioRef.current.play();
    }
  };

  const duckBackground = (to: number) => {
    if (!bgAudioRef.current) return;

    bgAudioRef.current.volume = to;
  };

  const play = async (track: Track) => {
    if (!enabled) return;

    startBackground();
    duckBackground(0.15);

    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[track]);
      audioRef.current.loop = false;
      audioRef.current.volume = 0;

      audioRef.current.onended = () => {
        duckBackground(0.2);
      };
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
      audioRef.current.volume = Math.min(v, 0.35);
      if (v >= 0.35) clearInterval(id);
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

  const muteAll = () => {
    if (audioRef.current) audioRef.current.muted = true;
    if (bgAudioRef.current) bgAudioRef.current.muted = true;
  };

  const unmuteAll = () => {
    if (audioRef.current) audioRef.current.muted = false;
    if (bgAudioRef.current) bgAudioRef.current.muted = false;
    bgAudioRef.current?.play().catch(() => {});
  };

  return (
    <AudioCtx.Provider value={{ play, stop, muteAll, unmuteAll, enabled, setEnabled }}>
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
