import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from 'antd'

type ResultData = {
  name: string
  join: boolean
  count: number
}

export default function Result() {
  const { state } = useLocation() as any
  const navigate = useNavigate()
  const [data, setData] = useState<ResultData | null>(null)

  useEffect(() => {
    // 1️⃣ Ưu tiên localStorage
    const saved = localStorage.getItem('boarding-pass')
    if (saved) {
      setData(JSON.parse(saved))
      return
    }

    // 2️⃣ Fallback từ state (lần đầu submit)
    if (state) {
      localStorage.setItem('boarding-pass', JSON.stringify(state))
      setData(state)
      return
    }

    // 3️⃣ Không có gì → quay về Home
    navigate('/', { replace: true })
  }, [state, navigate])

  if (!data) return null

  return (
    <div className="screen">
      <h1>🚆 ĐÃ GHI NHẬN</h1>

      <p><strong>Hành khách:</strong> {data.name}</p>

      <p>
        {data.join
          ? '🎉 Hẹn gặp bạn trên chuyến tàu!'
          : '😢 Hẹn dịp khác nhé!'}
      </p>

      {data.join && <p>Số người đi cùng: {data.count}</p>}

      {/* OPTIONAL */}
      <Button
        type="default"
        onClick={() => {
          localStorage.removeItem('boarding-pass')
          navigate('/', { replace: true })
        }}
      >
        ĐẶT LẠI 🎫
      </Button>
    </div>
  )
}
