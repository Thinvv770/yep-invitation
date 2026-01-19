import { motion } from 'framer-motion';

export default function Closed() {
  return (
    <div className="screen">
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
            <p className="intro-lead">⏳ Cảm ơn sự quan tâm của bạn</p>

            <p className="intro-cta">
              Quầy thủ tục của <strong>Chuyến tàu thời gian</strong> đã đóng.
              <br />
              Hẹn gặp lại bạn vào những chuyến tàu tiếp theo 😁
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
