import { Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';

export default function Home() {
  const navigate = useNavigate();
  const { play } = useAudio();

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
      <motion.div
        className="notice-paper"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          🚆 CHUYẾN TÀU THỜI GIAN
        </motion.h1>

        <div className="train">🚂🚃🚃🚃</div>

        <div className="intro">
          <p className="intro-lead">⏳ Một chuyến tàu đặc biệt sắp khởi hành…</p>

          <p>
            Không ai biết nó đến từ đâu.
            <br />
            Chỉ biết rằng nó chở đầy những mảnh ký ức của chúng ta.
          </p>

          <p>
            Khởi hành?
            <br />
            Ngay khi tất cả cùng đồng lòng <span className="highlight">lên tàu!</span>.
          </p>

          <p>
            Không cần vé, không cần hành lý
            <br />
            Chỉ cần <span className="highlight">nụ cười</span> – thứ nhiên liệu giúp đoàn tàu chạy
            nhanh hơn.
          </p>

          <p>
            Không phải để đi xa hơn,
            <br />
            mà để <span className="highlight">quay về</span>.
          </p>

          <p>Về những năm tháng đầu tiên, nơi mọi ký ức bắt đầu.</p>

          <p className="intro-cta">
            Bạn đã sẵn sàng cho <strong>Chuyến tàu thời gian</strong> chưa?
            <br />
            Nếu đã sẵn sàng, hãy làm thủ tục lên tàu nào 😁
          </p>
        </div>

        <Space>
          <Button
            type="primary"
            className="retro-btn"
            style={{
              position: pos.x || pos.y ? 'fixed' : 'relative',
              left: pos.x || undefined,
              top: pos.y || undefined,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={moveButton}
            onMouseDown={moveButton}
          >
            Ở lại hiện tại 😢
          </Button>
          <Button
            type="primary"
            className="retro-btn"
            onClick={() => {
              play('home');
              navigate('/survey');
            }}
          >
            LÊN TÀU 🚀
          </Button>
        </Space>
      </motion.div>
    </div>
  );
}
