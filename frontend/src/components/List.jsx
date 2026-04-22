import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardModal from './CardModal'

function Card({ card, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    cursor: 'grab',
    fontSize: '14px',
    color: '#172b4d'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      {card.title}
      {card.assignedUser && (
        <div style={{
          fontSize: '11px',
          color: '#5e6c84',
          marginTop: '6px',
          backgroundColor: '#f4f5f7',
          padding: '2px 6px',
          borderRadius: '10px',
          display: 'inline-block'
        }}>
          👤 {card.assignedUser}
        </div>
      )}
      {card.comments && card.comments.length > 0 && (
        <div style={{ fontSize: '11px', color: '#5e6c84', marginTop: '4px' }}>
          💬 {card.comments.length} comentario{card.comments.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

function List({ list, usuarios, onAddCard, onAddComment, onAssignUser }) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)

  const { setNodeRef } = useDroppable({ id: list.id })

  function handleAdd() {
    if (newTitle.trim() === '') return
    onAddCard(newTitle)
    setNewTitle('')
    setAdding(false)
  }

  return (
    <>
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '12px',
        width: '270px',
        minWidth: '270px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <h3 style={{
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#fff'
        }}>
          {list.title}
        </h3>

        <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef}>
            {list.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>
        </SortableContext>

        {adding ? (
          <div style={{ marginTop: '8px' }}>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título de la tarjeta"
              style={{
                width: '100%', padding: '8px',
                borderRadius: '6px', border: 'none',
                marginBottom: '6px', fontSize: '14px',
                outline: 'none'
              }}
            />
            <button onClick={handleAdd} style={{
              backgroundColor: '#0079bf', color: 'white',
              border: 'none', borderRadius: '6px',
              padding: '6px 12px', cursor: 'pointer',
              marginRight: '6px', fontSize: '13px'
            }}>
              Agregar
            </button>
            <button onClick={() => setAdding(false)} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '16px', color: 'white'
            }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px dashed rgba(255,255,255,0.3)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px',
            width: '100%',
            textAlign: 'left',
            borderRadius: '8px',
            marginTop: '4px',
            fontSize: '13px'
          }}>
            + Agregar tarjeta
          </button>
        )}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          usuarios={usuarios}   
          onClose={() => setSelectedCard(null)}
          onAddComment={(cardId, comment) => {
            onAddComment(cardId, comment)
            setSelectedCard(prev => ({
              ...prev,
              comments: [...(prev.comments || []), comment]
            }))
          }}
          onAssignUser={(cardId, user) => {
            onAssignUser(cardId, user)
            setSelectedCard(prev => ({
              ...prev,
              assignedUser: user
            }))
          }}
        />
      )}
    </>
  )
}

export default List