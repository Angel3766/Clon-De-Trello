// src/pages/BoardPage.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Board from '../components/Board'
import API, { USE_MOCK, MOCK } from '../api'

export default function BoardPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [boardName, setBoardName] = useState('')
  const [bgColor, setBgColor]     = useState('#0079bf')

  useEffect(() => {
    if (USE_MOCK) {
      const board = MOCK.boards[boardId]
      if (board) { setBoardName(board.name); setBgColor('#0079bf') }
      else navigate('/')
      return
    }
    API.get(`/boards/${boardId}/`)
      .then(res => { setBoardName(res.data.name); setBgColor(res.data.color || '#0079bf') })
      .catch(() => navigate('/'))
  }, [boardId])

  return (
    <div style={{ minHeight: '100vh', background: bgColor, fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar boardName={boardName} />
      <Board boardId={boardId} />
    </div>
  )
}