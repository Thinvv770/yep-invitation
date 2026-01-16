import './styles.css';

import { Spin } from 'antd';

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const Waiting = () => {
  return (
    <div className="container">
      <Spin tip="Chờ chút nhé..." fullscreen>
        {content}
      </Spin>
    </div>
  );
};

export default Waiting;
