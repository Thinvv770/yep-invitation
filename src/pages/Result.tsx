import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAudio } from '../components/Audio';
import { getUserKey } from '../components/helper';
import Waiting from '../components/Waiting';

type ResultData = {
  name: string;
  join: boolean;
  count: number;
};

export default function Result() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const { stop } = useAudio();

  const [handling, setHandling] = useState(false);

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

  const resetUser = async () => {
    setHandling(true);
    const userKey = getUserKey();

    const body = new URLSearchParams({
      action: 'reset',
      userKey,
    });

    await fetch(import.meta.env.VITE_SURVEY_API, {
      method: 'POST',
      body,
    });

    localStorage.removeItem('boarding-pass');
    localStorage.removeItem('user-key');
    setHandling(false);
  };

  return (
    <div className="screen">
      {handling ? <Waiting /> : null}
      <h1>🚆 ĐÃ GHI NHẬN</h1>

      <p>
        <strong>Hành khách:</strong> {initialData?.name}
      </p>

      <div className="final-message">
        {initialData?.join ? (
          <>
            <p className="final-title">🎉 Thủ tục hoàn tất.</p>
            <p className="final-sub">
              Thông tin chi tiết về chuyến đi sẽ được gửi đến bạn trong thời gian sớm nhất.
            </p>
            <p className="final-sub">Hẹn gặp bạn trên chuyến tàu thời gian. 🤗</p>
          </>
        ) : (
          <>
            <p className="final-title">😙 Không sao cả.</p>
            <p className="final-sub">Chuyến tàu này sẽ luôn sẵn sàng khi bạn đổi ý. 🥰</p>
          </>
        )}
      </div>

      {initialData?.join && <p>Số người đi cùng: {initialData?.count}</p>}

      <p>
        Quầy thủ tục sẽ đóng vào lúc <span className="highlight"> 23h59, ngày 18/01/2026</span>.
        <br /> <br /> Nếu có bất kỳ thay đổi nào, vui lòng hành khách cập nhật thông tin sớm nhất có
        thể.
      </p>

      <Button
        type="default"
        onClick={async () => {
          await resetUser();
          stop();
          document.body.classList.remove('bg-success');
          document.body.classList.add('bg-train');
          navigate('/home', { replace: true });
        }}
      >
        ĐẶT LẠI 🎫
      </Button>
    </div>
  );
}
