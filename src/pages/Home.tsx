import { Button, Input } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';

export default function Home() {
  const navigate = useNavigate();
  const { play } = useAudio();

  const inputRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('boarding-pass');
    if (saved) {
      navigate('/result', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.removeItem('boarding-draft');
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setPos({
      x: rect.left,
      y: rect.bottom + 12, // cách input 12px
    });
  }, []);

  const handleStart = () => {
    const payload = { name };

    localStorage.setItem('boarding-draft', JSON.stringify(payload));
    play('home');
    navigate('/survey', {
      state: payload,
    });
  };

  const moveButton = () => {
    const padding = 80;

    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;

    setPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  };

  return (
    <div className="screen">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🚆 CHUYẾN TÀU THỜI GIAN
      </motion.h1>

      <div className="train">🚃🚃🚃</div>

      <div className="intro">
        <p className="intro-lead">⏳ Một chuyến tàu đặc biệt sắp khởi hành…</p>

        <p>
          Không cần vé, không cần hành lý.
          <br />
          Chỉ cần mang theo <span className="highlight">ký ức</span>.
        </p>

        <p>
          Không phải để đi xa hơn,
          <br />
          mà để <span className="highlight">quay về</span>.
        </p>

        <p>
          Về những năm tháng đầu tiên,
          <br />
          nơi mọi ký ức bắt đầu.
        </p>

        <p className="intro-cta">
          Bạn đã sẵn sàng cho <strong>Chuyến tàu thời gian</strong> chưa?
          <br />
          Nếu đã sẵn sàng, vui lòng nhập tên để làm thủ tục lên tàu 😁
        </p>
      </div>

      <div ref={inputRef}>
        <Input
          placeholder="Nhập tên hành khách"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ maxWidth: 280 }}
        />
      </div>

      {name ? (
        <Button type="primary" className="retro-btn" disabled={!name} onClick={handleStart}>
          LÊN TÀU 🚀
        </Button>
      ) : (
        <Button
          type="primary"
          className="retro-btn"
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={moveButton}
          onMouseDown={moveButton}
        >
          Ở lại hiện tại 😢
        </Button>
      )}
    </div>
  );
}
