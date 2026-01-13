import { Button, notification } from 'antd';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';
import StationClock from '../components/StationClock';
import Steam from '../components/SteamFog';

const GOOGLE_FORM_ACTION = import.meta.env.VITE_GOOGLE_FORM_URL;

type SurveyData = {
  name: string;
  join: boolean;
  count: number;
  checkedAt: string;
};

export default function Boarding() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { stop, play } = useAudio();
  const passRef = useRef<HTMLDivElement>(null);

  const [isSubmit, setIsSubmit] = useState(false);

  const initialData = (() => {
    if (state) return state;

    const saved = localStorage.getItem('boarding-pass');
    if (saved) return JSON.parse(saved);
    return state ?? {};
  })();

  const { name: initialName, join, count: guests } = initialData;

  useEffect(() => {
    if (!initialName) {
      navigate('/', { replace: true });
      return;
    }

    const saved = localStorage.getItem('boarding-pass');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name) {
        navigate('/result', { replace: true });
      }
    }
  }, [initialName, navigate]);

  const handleSubmit = async () => {
    if (!initialName || join === null) return;

    const payload: SurveyData = {
      name: initialName,
      join,
      count: join ? guests : 0,
      checkedAt: new Date().toLocaleString(),
    };

    localStorage.setItem('boarding-pass', JSON.stringify(payload));

    const formBody = new URLSearchParams({
      'entry.1107872087': payload.name,
      'entry.1339218343': payload.join ? 'Yes' : 'No',
      'entry.380542753': String(payload.count),
    });

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: formBody,
      });
      notification.success({
        message: 'Chúc mừng bạn đã hoàn tất thủ tục.',
        description: 'Bạn có thể tải vé ở dưới đây hoặc tiếp tục tới bước tiếp theo.',
      });
      setIsSubmit(true);
    } catch (err) {
      console.warn('Google Form submit failed', err);
    }
  };

  const saveAsImage = async () => {
    if (!passRef.current) return;

    const dataUrl = await toPng(passRef.current, {
      backgroundColor: '#f5f0e6', // màu giấy retro
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = `boarding-pass-${initialName}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <StationClock />

      <div className="fx-layer">
        <Steam />
      </div>

      <div className="boarding-pass" ref={passRef}>
        <h2>🎫 Thẻ lên tàu</h2>
        <p>
          <strong>Hành khách:</strong> {initialName}
        </p>
        <p>
          <strong>Ngày đi:</strong> 31/01/2026
        </p>
        <p>
          <strong>Giờ đi:</strong> 17h00
        </p>
        <p>
          <strong>Ga đi:</strong> Địa chỉ nhà hàng...
        </p>
        <p>
          <strong>Ga đến:</strong> Thập niên 2000 ✨
        </p>
        <p>
          <strong>Hành khách đồng hành:</strong> {guests || 0}
        </p>
      </div>

      {!isSubmit ? (
        <div className="actions">
          <Button
            onClick={() => {
              stop();
              navigate(-1);
            }}
          >
            ⬅ Chỉnh sửa thông tin
          </Button>

          <Button type="primary" className="retro-btn" onClick={handleSubmit}>
            XÁC NHẬN 🎫
          </Button>
        </div>
      ) : (
        <div className="actions">
          <Button type="primary" onClick={saveAsImage}>
            💾 Lưu vé (PNG)
          </Button>

          <Button
            className="retro-btn"
            onClick={() => {
              play('departure');
              navigate('/result', { replace: true });
            }}
          >
            🚂 Lên tàu
          </Button>
        </div>
      )}
    </div>
  );
}
