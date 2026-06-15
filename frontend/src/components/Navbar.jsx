// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar({ boardName = null }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      {/* Izquierda: logo + home */}
      <div style={styles.left}>
        <button onClick={() => navigate('/')} style={styles.logoBtn}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <rect x="2.5" y="3" width="8" height="14" rx="2"/>
            <rect x="13.5" y="3" width="8" height="9" rx="2"/>
          </svg>
          <span style={styles.logoText}>Trello</span>
        </button>

        {boardName && (
          <>
            <span style={styles.sep}>/</span>
            <span style={styles.boardName}>{boardName}</span>
          </>
        )}
      </div>

      {/* Derecha: avatar + logout */}
      {user && (
        <div style={styles.right}>
          <div style={styles.avatar}>
            {user.username[0].toUpperCase()}
          </div>
          <span style={styles.username}>{user.username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    height: '44px',
    background: 'rgba(0,0,0,0.32)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none', borderRadius: '4px',
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '4px 10px', cursor: 'pointer',
    color: 'white', transition: 'background 0.15s'
  },
  logoText: { fontSize: '16px', fontWeight: '700', color: 'white' },
  sep: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', margin: '0 4px' },
  boardName: { fontSize: '15px', fontWeight: '600', color: 'white' },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '30px', height: '30px',
    background: '#0052cc',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '13px', fontWeight: '700',
    border: '2px solid rgba(255,255,255,0.4)'
  },
  username: { fontSize: '13px', color: 'rgba(255,255,255,0.85)' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px', padding: '4px 10px',
    color: 'white', fontSize: '12px', cursor: 'pointer'
  }
}