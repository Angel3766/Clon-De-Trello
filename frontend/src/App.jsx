// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import WorkspacesPage from './pages/WorkspacesPage'
import BoardPage      from './pages/BoardPage'

function RutaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ color: 'white', padding: 40 }}>Cargando...</div>
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <RutaProtegida><WorkspacesPage /></RutaProtegida>
        }/>
        <Route path="/board/:boardId" element={
          <RutaProtegida><BoardPage /></RutaProtegida>
        }/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App