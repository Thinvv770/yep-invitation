import { Route, Routes } from 'react-router-dom';

import Boarding from './pages/Boarding';
import Home from './pages/Home';
import Result from './pages/Result';
import Survey from './pages/Survey';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boarding" element={<Boarding />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}
