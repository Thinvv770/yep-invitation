import { Button } from 'antd';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';

type ResultData = {
  name: string;
  join: boolean;
  count: number;
};

export default function Result() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const { stop } = useAudio();

  const initialData = useMemo<ResultData | null>(() => {
    const saved = localStorage.getItem('boarding-pass');
    if (saved) return JSON.parse(saved);
    return state ?? null;
  }, [state]);

  useEffect(() => {
    if (!initialData) {
      navigate('/', { replace: true });
    }
  }, [initialData, navigate]);

  return (
    <div className="screen">
      <h1>🚆 ĐÃ GHI NHẬN</h1>

      <p>
        <strong>Hành khách:</strong> {initialData?.name}
      </p>

      <div className="final-message">
        {initialData?.join ? (
          <>
            <p className="final-title">🎉 Thủ tục hoàn tất.</p>
            <p className="final-sub">Hẹn gặp bạn trên chuyến tàu thời gian. 🤗</p>
          </>
        ) : (
          <>
            <p className="final-title">😙 Không sao cả.</p>
            <p className="final-sub">Chuyến tàu này sẽ luôn sẵn sàng khi bạn muốn quay về. 🥰</p>
          </>
        )}
      </div>

      {initialData?.join && <p>Số người đi cùng: {initialData?.count}</p>}

      <Button
        type="default"
        onClick={() => {
          localStorage.removeItem('boarding-pass');
          stop();
          navigate('/home', { replace: true });
        }}
      >
        ĐẶT LẠI 🎫
      </Button>
    </div>
  );
}
