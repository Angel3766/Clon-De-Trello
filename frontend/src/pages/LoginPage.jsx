// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="white">
            <rect x="2.5" y="3" width="8" height="14" rx="2"/>
            <rect x="13.5" y="3" width="8" height="9" rx="2"/>
          </svg>
        </div>
        <h1 style={styles.title}>Iniciar sesión</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando...' : 'Continuar'}
          </button>
        </form>

        <hr style={styles.divider} />

        <p style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0052cc 0%, #0079bf 50%, #00aecc 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '32px 40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
  },
  logoWrap: {
    background: '#0079bf',
    width: '50px', height: '50px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  title: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '600',
    color: '#172b4d',
    marginBottom: '24px'
  },
  error: {
    background: '#ffebe6',
    color: '#bf2600',
    padding: '10px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '16px'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#172b4d', letterSpacing: '0.3px' },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '2px solid #dfe1e6',
    fontSize: '14px',
    color: '#172b4d',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  btn: {
    background: '#0079bf',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '6px',
    transition: 'background 0.15s'
  },
  divider: { border: 'none', borderTop: '1px solid #ebecf0', margin: '24px 0' },
  footer: { textAlign: 'center', fontSize: '13px', color: '#5e6c84' },
  link: { color: '#0079bf', fontWeight: '600', textDecoration: 'none' }
}