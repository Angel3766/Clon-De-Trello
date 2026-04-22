import { useState } from 'react'

function CardModal({ card, usuarios, onClose, onAddComment, onAssignUser }) {
  const [comment, setComment] = useState('')

  function handleSubmit() {
    if (comment.trim() === '') return
    onAddComment(card.id, comment)
    setComment('')
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '16px',
        padding: '24px',
        width: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', color: 'white', fontWeight: 'bold' }}>
            🃏 {card.title}
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none',
            cursor: 'pointer', fontSize: '16px', color: 'white',
            borderRadius: '50%', width: '30px', height: '30px'
          }}>✕</button>
        </div>

        <h4 style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          👤 Asignar usuario
        </h4>

        <select
          value={card.assignedUser || ''}
          onChange={(e) => onAssignUser(card.id, e.target.value)}
          style={{
            width: '100%', padding: '8px',
            borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '20px', fontSize: '14px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer'
          }}
        >
          <option value='' style={{ background: '#1a1a2e' }}>
            Sin asignar
          </option>

          {usuarios && usuarios.map(u => (
            <option
              key={u.id}
              value={u.id}
              style={{ background: '#1a1a2e' }}
            >
              {u.username}
            </option>
          ))}
        </select>

        <h4 style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          💬 Comentarios
        </h4>

        <div style={{ marginBottom: '12px' }}>
          {card.comments && card.comments.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontStyle: 'italic' }}>
              Sin comentarios aún
            </p>
          )}

          {card.comments && card.comments.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '6px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
              borderLeft: '3px solid #0079bf'
            }}>
              {c}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe un comentario..."
            style={{
              flex: 1, padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white', fontSize: '14px',
              outline: 'none'
            }}
          />

          <button onClick={handleSubmit} style={{
            backgroundColor: '#0079bf', color: 'white',
            border: 'none', borderRadius: '8px',
            padding: '8px 16px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 'bold'
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal