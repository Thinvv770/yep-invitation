import { Button, Input } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';

export default function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { play } = useAudio();

  useEffect(() => {
    const saved = localStorage.getItem('boarding-pass');
    if (saved) {
      navigate('/result', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.removeItem('boarding-draft');
  }, []);

  const handleStart = () => {
    const payload = { name };

    localStorage.setItem('boarding-draft', JSON.stringify(payload));
    play('home');
    navigate('/survey', {
      state: payload,
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
          Hành khách vui lòng nhập tên để làm thủ tục lên tàu 😁
        </p>
      </div>

      <Input
        placeholder="Nhập tên hành khách"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ maxWidth: 280 }}
      />

      <Button type="primary" className="retro-btn" disabled={!name} onClick={handleStart}>
        LÊN TÀU 🚀
      </Button>
    </div>
  );
}
