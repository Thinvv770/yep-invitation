import { useAudio } from './Audio';

export default function MuteButton() {
  const { enabled, setEnabled, stop } = useAudio();

  return (
    <button
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem('audio-enabled', String(next));
        if (!next) stop();
      }}
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 9999,
        opacity: 0.6,
        transition: 'opacity 0.3s',
      }}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
