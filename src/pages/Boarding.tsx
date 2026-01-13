import { Button } from 'antd';
import { useEffect } from 'react';
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
    } catch (err) {
      console.warn('Google Form submit failed', err);
    }

    play('departure');
    navigate('/result', { replace: true });
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <StationClock />

      <div className="fx-layer">
        <Steam />
      </div>

      <div className="boarding-pass">
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
    </div>
  );
}
