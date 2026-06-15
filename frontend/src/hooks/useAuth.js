// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import API, { USE_MOCK, MOCK } from '../api'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function verificarSesion() {
      if (USE_MOCK) {
        const guardado = localStorage.getItem('mock_user')
        setUser(guardado ? JSON.parse(guardado) : null)
        setLoading(false)
        return
      }
      try {
        const res = await API.get('/auth/me/')
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verificarSesion()
  }, [])

  async function login(username, password) {
    if (USE_MOCK) {
      localStorage.setItem('mock_user', JSON.stringify(MOCK.user))
      localStorage.setItem('token', 'mock-token-123')
      setUser(MOCK.user)
      return
    }
    const res = await API.post('/auth/login/', { username, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  async function register(username, email, password) {
    if (USE_MOCK) {
      const nuevo = { id: 99, username, email }
      localStorage.setItem('mock_user', JSON.stringify(nuevo))
      localStorage.setItem('token', 'mock-token-123')
      setUser(nuevo)
      return
    }
    const res = await API.post('/auth/register/', { username, email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('mock_user')
    setUser(null)
    if (!USE_MOCK) API.post('/auth/logout/')
  }

  return { user, loading, login, register, logout }
}