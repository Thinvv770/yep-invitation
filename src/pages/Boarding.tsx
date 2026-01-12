import { Card, Button } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import StationClock from '../components/StationClock'
import Steam from '../components/SteamFog'
import { useEffect, useState } from 'react'
import { useAudio } from '../components/Audio'

export default function Boarding() {
  const navigate = useNavigate()
  const location = useLocation()
          const {  play } = useAudio()
  

  const [name, setName] = useState<string>('')

  useEffect(() => {
    if (location.state?.name) {
      setName(location.state.name)
    } else {
      // fallback khi reload
      const saved = localStorage.getItem('boarding-draft')
      if (saved) {
        setName(JSON.parse(saved).name)
      } else {
        navigate('/')
      }
    }
  }, [location.state, navigate])

  const handleNext = () => {
play('boarding')
    navigate('/survey', {
      state: { name },
    })
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <StationClock />

      <div className="fx-layer">
        <Steam />
      </div>

      <div className="boarding-pass">
        <h2>🎫 Thẻ lên tàu</h2>
        <p><strong>Hành khách:</strong> {name}</p>
        <p><strong>Sự kiện:</strong> Year End Party</p>
        <p><strong>Chủ đề:</strong> Thập niên 2000</p>
        <p><strong>Thời gian:</strong> 19:00 - 31/12</p>
        <p><strong>Ga đến:</strong> Quá Khứ ✨</p>
      </div>

      <div className="actions">
        <Button onClick={() => {
          stop();
          navigate(-1)}}>
          ← Quay lại
        </Button>

        <Button
          type="primary"
          className="retro-btn"
          onClick={handleNext}
        >
          LÀM THỦ TỤC 🚆
        </Button>
      </div>
    </div>
  )
}
