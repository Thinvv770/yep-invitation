import './Gate.css';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import gate from '../assets/images/gate.jpg';
import { useAudio } from './Audio';

export default function Gate() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { play } = useAudio();

  const bgRef = useRef(null);
  const doorRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('boarding-pass');
    if (saved) {
      navigate('/result', { replace: true });
    }
  }, [navigate]);

  const handleOpen = () => {
    play('gate');

    setTimeout(() => {
      setOpen(true);
    }, 500);

    setTimeout(() => {
      play('whoosh');
    }, 1500);

    setTimeout(() => {
      play('horn');
      navigate('/home');
    }, 3000);
  };

  useEffect(() => {
    const updateDoor = () => {
      const img = bgRef.current as HTMLImageElement | null;
      const door = doorRef.current as HTMLDivElement | null;
      if (!img || !door) return;

      const boxW = img.clientWidth;
      const boxH = img.clientHeight;

      const IMG_W = 1920;
      const IMG_H = 1080;

      const imgRatio = IMG_W / IMG_H;
      const boxRatio = boxW / boxH;

      let drawW: number, drawH: number, offsetX: number, offsetY: number;

      if (imgRatio > boxRatio) {
        drawH = boxH;
        drawW = drawH * imgRatio;
        offsetX = (boxW - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = boxW;
        drawH = drawW / imgRatio;
        offsetX = 0;
        offsetY = (boxH - drawH) / 2;
      }

      const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const t = clamp((boxRatio - 1.6) / (1.9 - 1.6), 0, 1);

      const BASE_X = 0.5;
      const BASE_Y = 0.68;
      const BASE_W = 0.165;

      const FIX_Y = 0.7;
      const FIX_W = 0.225;

      const DOOR_X = BASE_X;
      const DOOR_Y = lerp(BASE_Y, FIX_Y, t);
      const DOOR_W = lerp(BASE_W, FIX_W, t);

      const left = offsetX + drawW * DOOR_X;
      const top = offsetY + drawH * DOOR_Y;
      const width = drawW * DOOR_W;

      door.style.left = `${left}px`;
      door.style.top = `${top}px`;
      door.style.width = `${width}px`;
    };

    updateDoor();
    window.addEventListener('resize', updateDoor);
    return () => window.removeEventListener('resize', updateDoor);
  }, []);

  return (
    <div className={`gate-screen ${open ? 'open' : ''}`}>
      <motion.div
        className="scene"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={open ? { opacity: 1, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{
          duration: 3.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <img src={gate} className="bg" ref={bgRef} />

        <div ref={doorRef} className="door-mask">
          <motion.div
            className="door left"
            animate={open ? { rotateY: -100, z: -80 } : {}}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="light-slit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.4,
              delay: 0.3,
              ease: 'easeOut',
            }}
          />

          <motion.div
            className="door right"
            animate={open ? { rotateY: 100, z: -80 } : {}}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.div
          className="light"
          initial={{
            opacity: 0,
            scaleX: 0.2,
            scaleY: 0.4,
          }}
          animate={
            open
              ? {
                  opacity: 1,
                  scaleX: 1.4,
                  scaleY: 1.2,
                }
              : {
                  opacity: 0,
                  scaleX: 0.2,
                  scaleY: 0.4,
                }
          }
          transition={{
            duration: 3.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </motion.div>

      {!open && (
        <motion.button
          className="enter-btn"
          initial={{ opacity: 0, x: '-50%', y: -40 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1,
            ease: 'easeOut',
          }}
          onClick={handleOpen}
        >
          MỞ CỬA
        </motion.button>
      )}
    </div>
  );
}
