import './styles.css';

import { Input, InputNumber, Radio, Space } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

export const StepRenderer = ({ step, value, onChange, onNext, onPrev }: any) => {
  return (
    <AnimatePresence mode="wait">
      <StepCard
        key={step.id}
        step={step}
        value={value}
        onChange={onChange}
        onNext={onNext}
        onPrev={onPrev}
      />
    </AnimatePresence>
  );
};

const StepCard = ({ step, value, onChange, onNext, onPrev }: any) => {
  const isDisabled = step.id === 'join' ? typeof value !== 'boolean' : !value;

  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5 }}
    >
      <p className="step-lead">{step.lead}</p>

      {step.type === 'textarea' ? (
        <Input.TextArea
          placeholder={step.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {step.type === 'text' ? (
        <Input
          type={step.type}
          placeholder={step.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {step.type === 'number' ? (
        <InputNumber
          style={{ width: '100%' }}
          type={step.type}
          placeholder={step.placeholder}
          value={value || 0}
          onChange={(e) => onChange(e)}
        />
      ) : null}

      {step.type === 'radio' ? (
        <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
          <Radio style={{ color: 'white' }} value={true}>
            Lên tàu 🎉
          </Radio>
          <Radio style={{ color: 'white' }} value={false}>
            Ở lại hiện tại 😢
          </Radio>
        </Radio.Group>
      ) : null}

      <Space>
        {onPrev ? (
          <button className="step-btn" onClick={onPrev}>
            Quay lại
          </button>
        ) : null}
        <button
          className="step-btn"
          disabled={step.type === 'number' ? false : isDisabled}
          onClick={onNext}
        >
          Tiếp tục →
        </button>
      </Space>
    </motion.div>
  );
};
