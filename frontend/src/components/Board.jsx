import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import List from './List'
import API from '../api'

function Board() {
  const [data, setData] = useState({ lists: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const boardsRes = await API.get('/boards/')
      const listsRes = await API.get('/lists/')
      const cardsRes = await API.get('/cards/')

      const lists = listsRes.data.map(list => ({
        ...list,
        id: list.id.toString(),
        title: list.name,
        cards: cardsRes.data
          .filter(card => card.list === list.id)
          .map(card => ({
            ...card,
            id: card.id.toString(),
            comments: []
          }))
      }))

      setData({ lists })
      setLoading(false)
    } catch (error) {
      console.error('Error cargando datos:', error)
      setLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  function onDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    let sourceListId = null
    let destListId = null
    let movedCard = null

    data.lists.forEach(list => {
      const cardIndex = list.cards.findIndex(c => c.id === activeId)
      if (cardIndex !== -1) {
        sourceListId = list.id
        movedCard = list.cards[cardIndex]
      }
    })

    data.lists.forEach(list => {
      if (list.id === overId) destListId = list.id
      const found = list.cards.find(c => c.id === overId)
      if (found) destListId = list.id
    })

    if (!destListId || !movedCard || sourceListId === destListId) return

    API.patch(`/cards/${activeId}/`, { list: parseInt(destListId) })

    const updatedLists = data.lists.map(list => {
      if (list.id === sourceListId) {
        return { ...list, cards: list.cards.filter(c => c.id !== activeId) }
      }
      if (list.id === destListId) {
        return { ...list, cards: [...list.cards, movedCard] }
      }
      return list
    })

    setData({ lists: updatedLists })
  }

  async function onAddCard(listId, title) {
    try {
      const res = await API.post('/cards/', {
        title,
        description: ' ',
        list: parseInt(listId),
        assigned_to: null,
        position: 0
      })
      const newCard = {
        ...res.data,
        id: res.data.id.toString(),
        comments: []
      }
      const newLists = data.lists.map(list => {
        if (list.id === listId) return { ...list, cards: [...list.cards, newCard] }
        return list
      })
      setData({ lists: newLists })
    } catch (error) {
      console.error('Error creando tarjeta:', error.response?.data)
    }
  }

  async function onAddComment(cardId, comment) {
    try {
      await API.post('/comments/', {
        content: comment,
        card: parseInt(cardId),
        user: 1
      })
      const newLists = data.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => {
          if (card.id === cardId) return { ...card, comments: [...(card.comments || []), comment] }
          return card
        })
      }))
      setData({ lists: newLists })
    } catch (error) {
      console.error('Error agregando comentario:', error.response?.data)
    }
  }

  async function onAssignUser(cardId, user) {
    try {
      await API.patch(`/cards/${cardId}/`, { assigned_to: user === '' ? null : parseInt(user) })
      const newLists = data.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => {
          if (card.id === cardId) return { ...card, assignedUser: user }
          return card
        })
      }))
      setData({ lists: newLists })
    } catch (error) {
      console.error('Error asignando usuario:', error.response?.data)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: 'calc(100vh - 48px)',
        color: 'white', fontSize: '18px'
      }}>
        Cargando tablero...
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        minHeight: 'calc(100vh - 48px)'
      }}>
        {data.lists.map((list) => (
          <List
            key={list.id}
            list={list}
            onAddCard={(title) => onAddCard(list.id, title)}
            onAddComment={onAddComment}
            onAssignUser={onAssignUser}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Board