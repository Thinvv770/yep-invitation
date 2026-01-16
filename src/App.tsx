import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Gate from './components/Gate';
import Boarding from './pages/Boarding';
import Home from './pages/Home';
import Result from './pages/Result';
import Survey from './pages/Survey';

export default function App() {
  useEffect(() => {
    document.body.classList.add('bg-train');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Gate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/boarding" element={<Boarding />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}
