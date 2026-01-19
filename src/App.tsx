import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Closed from './pages/Closed';

export default function App() {
  useEffect(() => {
    document.body.classList.add('bg-train');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Closed />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* <Route path="/home" element={<Home />} />
      <Route path="/boarding" element={<Boarding />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/result" element={<Result />} /> */}
    </Routes>
  );
}
