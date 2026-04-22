// src/components/Board.jsx
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import List from './List'
import API, { USE_MOCK, MOCK } from '../api'

function Board({ boardId }) {
  const [data, setData] = useState({ lists: [] })
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [boardId])

  async function cargarDatos() {
    setLoading(true)
    try {
      // ── MOCK ──────────────────────────────────────────────
      if (USE_MOCK) {
        const board = MOCK.boards[boardId]
        if (board) {
          const lists = board.lists.map(list => ({
            ...list,
            id: list.id.toString(),
            title: list.name,
            cards: list.cards.map(card => ({
              ...card,
              id: card.id.toString(),
              comments: card.comments || []
            }))
          }))
          setData({ lists })
          setUsuarios(MOCK.users)
        }
        setLoading(false)
        return
      }

      // ── REAL ──────────────────────────────────────────────
      const listsRes    = await API.get(`/lists/?board=${boardId}`)
      const cardsRes    = await API.get(`/cards/?board=${boardId}`)
      const commentsRes = await API.get('/comments/')
      const usuariosRes = await API.get('/users/')

      const lists = listsRes.data.map(list => ({
        ...list,
        id: list.id.toString(),
        title: list.name,
        cards: cardsRes.data
          .filter(card => card.list === list.id)
          .map(card => ({
            ...card,
            id: card.id.toString(),
            comments: commentsRes.data
              .filter(c => c.card === card.id)
              .map(c => c.content)
          }))
      }))

      setData({ lists })
      setUsuarios(usuariosRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  function findCardById(cardId) {
    for (const list of data.lists) {
      const card = list.cards.find(c => c.id === cardId)
      if (card) return { card, list }
    }
    return null
  }

  function onDragStart(event) {
    const { active } = event
    const result = findCardById(active.id)
    if (result) setActiveCard(result.card)
  }

  function onDragOver(event) {
    const { active, over } = event
    if (!over) return

    const activeData = findCardById(active.id)
    if (!activeData) return

    const activeCardObj = activeData.card
    const activeList = activeData.list
    const overId = over.id

    let overList = data.lists.find(l => l.id === overId)
    if (!overList) {
      const overCardData = findCardById(overId)
      if (overCardData) overList = overCardData.list
    }

    if (!overList || activeList.id === overList.id) return

    const updatedLists = data.lists.map(list => {
      if (list.id === activeList.id) {
        return { ...list, cards: list.cards.filter(c => c.id !== activeCardObj.id) }
      }
      if (list.id === overList.id) {
        return { ...list, cards: [...list.cards, activeCardObj] }
      }
      return list
    })

    setData({ lists: updatedLists })
  }

  function findListByCardId(cardId) {
    return data.lists.find(list =>
      list.cards.some(card => card.id === cardId)
    )
  }

  function onDragEnd(event) {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeData = findCardById(activeId)
    if (!activeData) return

    const activeCardObj = activeData.card
    const activeList = activeData.list

    let overList = data.lists.find(l => l.id === overId)
    if (!overList) {
      const overCardData = findCardById(overId)
      if (overCardData) overList = overCardData.list
    }

    if (!overList) return

    if (!USE_MOCK) {
      API.patch(`/cards/${activeId}/`, { list: parseInt(overList.id) })
    }

    if (activeList.id === overList.id) {
      const cards = [...activeList.cards]
      const oldIndex = cards.findIndex(c => c.id === activeId)
      const newIndex = cards.findIndex(c => c.id === overId)
      if (oldIndex !== newIndex && newIndex !== -1) {
        cards.splice(oldIndex, 1)
        cards.splice(newIndex, 0, activeCardObj)
        setData(prev => ({
          lists: prev.lists.map(list =>
            list.id === activeList.id ? { ...list, cards } : list
          )
        }))
      }
    }
  }

  async function onAddCard(listId, title) {
    try {
      if (USE_MOCK) {
        const newCard = {
          id: Date.now().toString(),
          title,
          description: '',
          list: parseInt(listId),
          assigned_to: null,
          comments: []
        }
        setData(prev => ({
          lists: prev.lists.map(list =>
            list.id === listId
              ? { ...list, cards: [...list.cards, newCard] }
              : list
          )
        }))
        return
      }

      const res = await API.post('/cards/', {
        title,
        description: ' ',
        list: parseInt(listId),
        assigned_to: null,
        position: 0
      })
      const newCard = { ...res.data, id: res.data.id.toString(), comments: [] }
      setData(prev => ({
        lists: prev.lists.map(list =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      }))
    } catch (error) {
      console.error('Error creando tarjeta:', error.response?.data)
    }
  }

  async function onAddComment(cardId, comment) {
    try {
      if (!USE_MOCK) {
        await API.post('/comments/', {
          content: comment,
          card: parseInt(cardId),
          user: 1
        })
      }
      setData(prev => ({
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.map(card =>
            card.id === cardId
              ? { ...card, comments: [...(card.comments || []), comment] }
              : card
          )
        }))
      }))
    } catch (error) {
      console.error('Error agregando comentario:', error.response?.data)
    }
  }

  async function onAssignUser(cardId, userId) {
    try {
      if (!USE_MOCK) {
        await API.patch(`/cards/${cardId}/`, {
          assigned_to: userId === '' ? null : parseInt(userId)
        })
      }
      setData(prev => ({
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.map(card =>
            card.id === cardId
              ? { ...card, assigned_to: userId }
              : card
          )
        }))
      }))
    } catch (error) {
      console.error('Error asignando usuario:', error.response?.data)
    }
  }

  const [showAddList, setShowAddList] = useState(false)
  const [newListName, setNewListName] = useState('')

  async function onAddList() {
    if (!newListName.trim()) return
    try {
      if (!USE_MOCK) {
        const res = await API.post('/lists/', {
          name: newListName,
          board: parseInt(boardId),
          position: data.lists.length
        })
        const newList = { ...res.data, id: res.data.id.toString(), cards: [] }
        setData(prev => ({ lists: [...prev.lists, newList] }))
      }
      setNewListName('')
      setShowAddList(false)
    } catch (error) {
      console.error('Error creando lista:', error.response?.data)
    }
  }

if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 44px)',
        color: 'white',
        fontSize: '18px'
      }}>
        Cargando tablero...
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        minHeight: 'calc(100vh - 44px)',
        alignItems: 'flex-start'
      }}>
        {data.lists.map(list => (
          <List
            key={list.id}
            list={list}
            usuarios={usuarios}
            onAddCard={title => onAddCard(list.id, title)}
            onAddComment={onAddComment}
            onAssignUser={onAssignUser}
          />
        ))}

        {showAddList ? (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '200px'
          }}>
            <input
              type="text"
              placeholder="Nombre de lista..."
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAddList()}
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                outline: 'none',
                marginBottom: '8px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onAddList}
                style={{
                  background: '#5a5ad1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Añadir lista
              </button>
              <button
                onClick={() => { setShowAddList(false); setNewListName('') }}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddList(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '200px',
              textAlign: 'left',
              fontSize: '14px'
            }}
          >
            + Añadir otra lista
          </button>
        )}
      </div>
      <DragOverlay>
        {activeCard ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '10px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            fontSize: '14px',
            color: '#172b4d',
            transform: 'rotate(3deg)',
            opacity: 0.9,
            maxWidth: '250px'
          }}>
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board