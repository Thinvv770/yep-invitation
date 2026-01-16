import { Button, notification } from 'antd';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SurveyData } from 'types/Survey';

import { useAudio } from '../components/Audio';
import { getUserKey } from '../components/helper';
import StationClock from '../components/StationClock';
import Steam from '../components/SteamFog';
import Waiting from '../components/Waiting';

// const GOOGLE_FORM_ACTION = import.meta.env.VITE_GOOGLE_FORM_URL;
const SURVEY_API = import.meta.env.VITE_SURVEY_API;

export default function Boarding() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { stop, play } = useAudio();
  const passRef = useRef<HTMLDivElement>(null);

  const [isSubmit, setIsSubmit] = useState(false);
  const [seatNumber, setSeatNumber] = useState(0);
  const [handling, setHandling] = useState(false);

  const initialData = (() => {
    if (state) return state;

    const saved = localStorage.getItem('boarding-pass');
    if (saved) return JSON.parse(saved);
    return state ?? {};
  })();

  const { name: initialName, join, count: guests, nickname } = initialData;

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

  useEffect(() => {
    if (isSubmit) {
      document.body.classList.remove('bg-train');
      document.body.classList.add('bg-success');
    }
  }, [isSubmit]);

  const handleSubmit = async () => {
    if (!initialName || join === null) return;
    setHandling(true);

    try {
      const userKey = getUserKey();

      const body = new URLSearchParams({
        name: initialName,
        join,
        count: String(join ? guests : 0),
        userKey,
        nickname,
      });

      const res = await fetch(SURVEY_API, {
        method: 'POST',
        body,
      });

      const result = await res.json();

      setSeatNumber(result.randomNumber);

      if (result.error) {
        notification.error({ message: result.error });
        return;
      }

      const payload: SurveyData = {
        name: initialName,
        join,
        count: join ? guests : 0,
        checkedAt: new Date().toLocaleString(),
        randomNumber: result.randomNumber,
        userKey,
        nickname,
      };

      localStorage.setItem('boarding-pass', JSON.stringify(payload));

      notification.success({
        message: 'Chúc mừng bạn đã hoàn tất thủ tục.',
        description: `Bạn có thể tải vé ở dưới đây hoặc tiếp tục tới bước tiếp theo.`,
      });

      setIsSubmit(true);
      play('horn');
    } catch (err) {
      console.log(err);
    } finally {
      setHandling(false);
    }
  };

  const saveAsImage = async () => {
    if (!passRef.current) return;

    const dataUrl = await toPng(passRef.current, {
      backgroundColor: '#f5f0e6',
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = `boarding-pass-${initialName}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {handling ? <Waiting /> : null}
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
          <strong>Người thân đi cùng:</strong> {guests || 0}
        </p>
        {isSubmit ? (
          <p>
            <strong>Số ghế:</strong> {seatNumber}
          </p>
        ) : null}
      </div>

      {!isSubmit ? (
        <div className="actions">
          <Button
            onClick={() => {
              stop();
              navigate('/survey', {
                state: {},
                replace: true,
              });
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
