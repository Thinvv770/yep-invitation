import { Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from '../components/Audio'

export default function Home() {
  const [name, setName] = useState('')
  const navigate = useNavigate()
        const { play } = useAudio()



  /* 🔁 AUTO REDIRECT NẾU ĐÃ CHECK-IN */
  useEffect(() => {
    const saved = localStorage.getItem('boarding-pass')
    if (saved) {
      navigate('/result', { replace: true })
    }
  }, [navigate])


  const handleStart = () => {
    const payload = { name }

    // lưu tạm cho flow tiếp theo
    localStorage.setItem('boarding-draft', JSON.stringify(payload))
play('home')
play('boarding')
    navigate('/boarding', {
      state: payload,
    })
  }

  return (
    <div className="screen">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🚆 CHUYẾN TÀU THỜI GIAN
      </motion.h1>

      <div className="train">🚃🚃🚃</div>
      <p>Quay về thập niên 2000</p>

      <Input
        placeholder="Nhập tên hành khách"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ maxWidth: 280 }}
      />

      <Button
        type="primary"
        className="retro-btn"
        disabled={!name}
        onClick={handleStart}
      >
        LÊN TÀU 🚀
      </Button>
    </div>
  )
}
