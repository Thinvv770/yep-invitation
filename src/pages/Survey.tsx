import { Button, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyData } from 'types/Survey';

import { useAudio } from '../components/Audio';
import { getUserKey } from '../components/helper';
import { StepRenderer } from '../components/SurveySteps';
import { BASESTEPS, JOINSTEPS } from '../components/SurveySteps/constants';
import Waiting from '../components/Waiting';

const SURVEY_API = import.meta.env.VITE_SURVEY_API;

export default function Survey() {
  const navigate = useNavigate();
  const { play, stop } = useAudio();

  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<any>({});
  const [handling, setHandling] = useState<boolean>(false);

  const computedSteps = (() => {
    if (data.join === true) {
      return [...BASESTEPS, JOINSTEPS.true];
    }

    if (data.join === false) {
      return [...BASESTEPS, JOINSTEPS.false];
    }

    return BASESTEPS;
  })();

  const isDone = stepIndex >= computedSteps.length;

  const next = () => setStepIndex((i) => i + 1);
  const prev = () => setStepIndex((i) => i - 1);

  const handleConfirmNoJoin = useCallback(async () => {
    if (!data.name || data.join === null) return;

    setHandling(true);

    try {
      const userKey = getUserKey();

      const body = new URLSearchParams({
        userKey,
        ...data,
      });

      const res = await fetch(SURVEY_API, {
        method: 'POST',
        body,
      });

      const result = await res.json();

      if (result.error) {
        notification.error({ message: result.error });
        return;
      }

      const payload: SurveyData = {
        name: data.name,
        join: data.join,
        count: 0,
        reason: data.reason,
        checkedAt: new Date().toLocaleString(),
        userKey,
      };

      localStorage.setItem('boarding-pass', JSON.stringify(payload));

      notification.success({
        message: 'Cảm ơn bạn.',
        description: `Hẹn bạn vào chuyến tàu tới.`,
      });

      play('refuse');
      navigate('/result', { replace: true });
    } catch (err) {
      console.log(err);
    } finally {
      setHandling(false);
    }
  }, [data, navigate, play]);

  useEffect(() => {
    if (!isDone || handling) return;

    const { join } = data;

    if (join) {
      play('boarding');
      navigate('/boarding', {
        state: {
          reason: '',
          count: data.count || 0,
          ...data,
        },
        replace: true,
      });
    } else {
      handleConfirmNoJoin();
    }
  }, [isDone, data, handling, navigate, play, handleConfirmNoJoin]);

  return (
    <div className="screen">
      {handling ? <Waiting /> : null}
      {!isDone && (
        <>
          <StepRenderer
            step={computedSteps[stepIndex]}
            value={data[computedSteps[stepIndex].id]}
            onChange={(val: any) =>
              setData((prev: any) => ({
                ...prev,
                [computedSteps[stepIndex].id]: val,
              }))
            }
            onNext={next}
            onPrev={stepIndex > 0 ? prev : undefined}
          />

          <Button
            onClick={() => {
              stop();
              navigate(-1);
            }}
          >
            ⬅ Quay lại ga trước
          </Button>
        </>
      )}
    </div>
  );
}
