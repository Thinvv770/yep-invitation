import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Boarding from './pages/Boarding'
import Survey from './pages/Survey'
import Result from './pages/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boarding" element={<Boarding />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
