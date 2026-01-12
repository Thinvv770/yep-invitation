import { Button, Radio, InputNumber } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAudio } from '../components/Audio'

const GOOGLE_FORM_ACTION = import.meta.env.VITE_GOOGLE_FORM_URL

console.log(GOOGLE_FORM_ACTION,'GOOGLE_FORM_ACTION');

type SurveyData = {
  name: string
  join: boolean
  count: number
  checkedAt: string
}

export default function Survey() {
  const navigate = useNavigate()
  const { state } = useLocation() as any
          const { enabled, setEnabled, stop, play } = useAudio()
  

  const [name, setName] = useState('')
  const [join, setJoin] = useState<boolean | null>(null)
  const [count, setCount] = useState(1)

  /* 🔁 LẤY NAME TỪ STATE / LOCAL */
  useEffect(() => {
    if (state?.name) {
      setName(state.name)
      return
    }

    const saved = localStorage.getItem('boarding-pass')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.name) {
        navigate('/result', { replace: true })
      }
    } else {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  const handleSubmit = async () => {
    if (!name || join === null) return

    const payload: SurveyData = {
      name,
      join,
      count: join ? count : 0,
      checkedAt: new Date().toLocaleString(),
    }

    /* 1️⃣ LƯU LOCAL */
    localStorage.setItem('boarding-pass', JSON.stringify(payload))

    /* 2️⃣ GỬI GOOGLE FORM */
    const formBody = new URLSearchParams({
      'entry.1107872087': payload.name,
      'entry.1339218343': payload.join ? 'Yes' : 'No',
      'entry.380542753': String(payload.count),
    })

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: formBody,
      })
    } catch (err) {
      console.warn('Google Form submit failed', err)
    }

    /* 3️⃣ SANG RESULT */
    navigate('/result', { replace: true })
  }

  if (!name) return null

  return (
    <div className="screen">
      <h2>{name}, bạn có tham gia chuyến tàu này không?</h2>

      <Radio.Group
        value={join}
        onChange={e => setJoin(e.target.value)}
      >
        <Radio style={{color: 'white'}} value={true}>Có 🎉</Radio>
        <Radio style={{color: 'white'}} value={false}>Không 😢</Radio>
      </Radio.Group>

      {join && (
        <div style={{ marginTop: 16 }}>
          <p>Số hành khách đi cùng</p>
          <InputNumber
            min={0}
            max={10}
            value={count}
            onChange={v => setCount(v || 1)}
          />
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Button onClick={() => {play('home');navigate(-1)}}>
          ⬅ QUAY LẠI
        </Button>

        {join !== null && (
          <Button
            type="primary"
            className="retro-btn"
            onClick={handleSubmit}
          >
            XÁC NHẬN 🎫
          </Button>
        )}
      </div>
    </div>
  )
}
