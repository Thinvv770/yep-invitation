import './Gate.css';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import gate from '../assets/images/gate.jpg';
import { useAudio } from './Audio';

export default function Gate() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { play } = useAudio();

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
        <img src={gate} className="bg" alt="gate" />

        <div className="door-mask">
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
