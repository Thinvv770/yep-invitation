import { Button, Input, InputNumber, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';

const GOOGLE_FORM_ACTION = import.meta.env.VITE_GOOGLE_FORM_URL;

type SurveyData = {
  name: string;
  join: boolean;
  count: number;
  reason: string;
  checkedAt: string;
};

export default function Survey() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const { play, stop } = useAudio();

  const initialName = (() => {
    if (state?.name) return state.name;
  })();

  const [join, setJoin] = useState(null);
  const [count, setCount] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!initialName) {
      navigate('/', { replace: true });
      return;
    }
  }, [initialName, navigate]);

  const handleNext = () => {
    play('boarding');
    navigate('/boarding', {
      state: { name: initialName, join, count },
    });
  };

  const handleConfirmNoJoin = async () => {
    if (!initialName || join === null) return;

    const payload: SurveyData = {
      name: initialName,
      join,
      count: 0,
      reason,
      checkedAt: new Date().toLocaleString(),
    };

    localStorage.setItem('boarding-pass', JSON.stringify(payload));

    const formBody = new URLSearchParams({
      'entry.1107872087': payload.name,
      'entry.1339218343': payload.join ? 'Yes' : 'No',
      'entry.380542753': String(payload.count),
      'entry.694704585': reason,
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

    play('refuse');
    navigate('/result', { replace: true });
  };

  return (
    <div className="screen">
      <h2>
        Hành khách <span className="highlight">{initialName}</span> đã sẵn sàng cho chuyến tàu này
        chưa?
      </h2>

      <Radio.Group value={join} onChange={(e) => setJoin(e.target.value)}>
        <Radio style={{ color: 'white' }} value={true}>
          Lên tàu 🎉
        </Radio>
        <Radio style={{ color: 'white' }} value={false}>
          Ở lại hiện tại 😢
        </Radio>
      </Radio.Group>

      {join !== null &&
        (join ? (
          <div style={{ marginTop: 16 }}>
            <p>Những hành khách đồng hành cùng bạn</p>
            <InputNumber min={0} max={10} value={count} onChange={(v) => setCount(v || 0)} />
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <p>Lí do bạn muốn ở lại (bắt buộc) 😥</p>
            <Input.TextArea
              rows={4}
              value={reason}
              placeholder="Nhập lí do"
              onChange={(v) => setReason(v.target.value)}
            />
          </div>
        ))}

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Button
          onClick={() => {
            stop();
            navigate(-1);
          }}
        >
          ⬅ Quay lại ga trước
        </Button>

        {join !== null &&
          (join ? (
            <Button type="primary" className="retro-btn" onClick={handleNext}>
              LÀM THỦ TỤC 🚆
            </Button>
          ) : (
            <Button
              type="primary"
              className="retro-btn"
              disabled={!reason}
              onClick={handleConfirmNoJoin}
            >
              Xác nhận 😭
            </Button>
          ))}
      </div>
    </div>
  );
}
