// src/api.js
import axios from 'axios'

export const USE_MOCK = false

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

// Inyecta el token en cada petición automáticamente
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  console.log('Token from localStorage:', token)
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

// ─── Mock data ───────────────────────────────────────────────
export const MOCK = {
  user: { id: 1, username: 'tú', email: 'tu@email.com' },

  workspaces: [
    {
      id: 1,
      name: 'Mi Workspace',
      boards: [
        { id: 1, name: 'Proyecto Escolar', color: '#0079bf' },
        { id: 2, name: 'Tareas Personales', color: '#d29034' },
      ]
    },
    {
      id: 2,
      name: 'Equipo Dev',
      boards: [
        { id: 3, name: 'Sprint Actual', color: '#519839' },
      ]
    }
  ],

  boards: {
    1: {
      id: 1, name: 'Proyecto Escolar',
      lists: [
        { id: 1, name: 'To Do',   cards: [{ id: 1, title: 'Diseñar login', comments: [], assigned_to: null }] },
        { id: 2, name: 'Doing',   cards: [{ id: 2, title: 'Hacer navbar',  comments: [], assigned_to: null }] },
        { id: 3, name: 'Done',    cards: [{ id: 3, title: 'Instalar deps', comments: [], assigned_to: null }] },
      ]
    }
  },

  users: [
    { id: 1, username: 'tú' },
    { id: 2, username: 'compañero' },
  ]
}

export default API