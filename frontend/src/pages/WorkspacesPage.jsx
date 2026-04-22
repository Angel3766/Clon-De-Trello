// src/pages/WorkspacesPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API, { USE_MOCK, MOCK } from '../api'

const COLORS = ['#0079bf','#d29034','#519839','#b04632','#89609e','#cd5a91','#4bbf6b','#00aecc']

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showNewBoard, setShowNewBoard]     = useState(null) // id del workspace activo
  const [showNewWorkspace, setShowNewWorkspace] = useState(false)
  const [newBoardName, setNewBoardName]     = useState('')
  const [newBoardColor, setNewBoardColor]   = useState(COLORS[0])
  const [newWsName, setNewWsName]           = useState('')
  const navigate = useNavigate()

  useEffect(() => { cargar() }, [])

  async function cargar() {
    if (USE_MOCK) {
      setWorkspaces(MOCK.workspaces)
      setLoading(false)
      return
    }
    try {
      const res = await API.get('/workspaces/')
      setWorkspaces(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function crearBoard(workspaceId) {
    if (!newBoardName.trim()) return
    if (USE_MOCK) {
      const nuevo = { id: Date.now(), name: newBoardName, color: newBoardColor }
      setWorkspaces(ws => ws.map(w =>
        w.id === workspaceId ? { ...w, boards: [...w.boards, nuevo] } : w
      ))
    } else {
      const res = await API.post('/boards/', { name: newBoardName, workspace: workspaceId, color: newBoardColor })
      setWorkspaces(ws => ws.map(w =>
        w.id === workspaceId ? { ...w, boards: [...w.boards, res.data] } : w
      ))
    }
    setNewBoardName('')
    setNewBoardColor(COLORS[0])
    setShowNewBoard(null)
  }

  async function crearWorkspace() {
    if (!newWsName.trim()) return
    if (USE_MOCK) {
      setWorkspaces(ws => [...ws, { id: Date.now(), name: newWsName, boards: [] }])
    } else {
      const res = await API.post('/workspaces/', { name: newWsName })
      setWorkspaces(ws => [...ws, { ...res.data, boards: [] }])
    }
    setNewWsName('')
    setShowNewWorkspace(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1d2125' }}>
      <Navbar />
      <p style={{ color: 'white', padding: 40 }}>Cargando...</p>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.body}>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <p style={styles.sideLabel}>Espacios de trabajo</p>
          {workspaces.map(ws => (
            <div key={ws.id} style={styles.sideItem}>
              <div style={{ ...styles.wsIcon, background: stringToColor(ws.name) }}>
                {ws.name[0].toUpperCase()}
              </div>
              <span style={styles.wsName}>{ws.name}</span>
            </div>
          ))}
          <button onClick={() => setShowNewWorkspace(true)} style={styles.sideNewBtn}>
            + Nuevo espacio
          </button>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          <h2 style={styles.mainTitle}>Tus espacios de trabajo</h2>

          {workspaces.map(ws => (
            <section key={ws.id} style={styles.wsSection}>
              <div style={styles.wsHeader}>
                <div style={{ ...styles.wsIconLg, background: stringToColor(ws.name) }}>
                  {ws.name[0].toUpperCase()}
                </div>
                <h3 style={styles.wsTitle}>{ws.name}</h3>
              </div>

              <div style={styles.boardsGrid}>
                {ws.boards.map(board => (
                  <button
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                    style={{ ...styles.boardCard, background: board.color || '#0079bf' }}
                  >
                    <span style={styles.boardCardName}>{board.name}</span>
                  </button>
                ))}

                {/* Botón crear tablero */}
                {showNewBoard === ws.id ? (
                  <div style={styles.newBoardForm}>
                    <input
                      autoFocus
                      placeholder="Título del tablero"
                      value={newBoardName}
                      onChange={e => setNewBoardName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && crearBoard(ws.id)}
                      style={styles.newBoardInput}
                    />
                    <div style={styles.colorPicker}>
                      {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setNewBoardColor(c)}
                          style={{
                            ...styles.colorDot,
                            background: c,
                            outline: newBoardColor === c ? '2px solid white' : 'none'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => crearBoard(ws.id)} style={styles.createBtn}>Crear</button>
                      <button onClick={() => setShowNewBoard(null)} style={styles.cancelBtn}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewBoard(ws.id)}
                    style={styles.addBoardBtn}
                  >
                    + Crear tablero
                  </button>
                )}
              </div>
            </section>
          ))}

          {/* Modal nuevo workspace */}
          {showNewWorkspace && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h3 style={styles.modalTitle}>Nuevo espacio de trabajo</h3>
                <input
                  autoFocus
                  placeholder="Nombre del espacio"
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
                  style={styles.modalInput}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowNewWorkspace(false)} style={styles.cancelBtn}>Cancelar</button>
                  <button onClick={crearWorkspace} style={styles.createBtn}>Crear</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `hsl(${h}, 55%, 35%)`
}

const styles = {
  page: { minHeight: '100vh', background: '#1d2125', fontFamily: "'Segoe UI', sans-serif" },
  body: { display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', gap: '32px' },
  sidebar: { width: '220px', flexShrink: 0 },
  sideLabel: { fontSize: '11px', fontWeight: '700', color: '#9fadbc', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' },
  sideItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', cursor: 'pointer', marginBottom: '4px' },
  wsIcon: { width: '26px', height: '26px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  wsName: { fontSize: '14px', color: '#b6c2cf', fontWeight: '500' },
  sideNewBtn: { background: 'none', border: 'none', color: '#9fadbc', fontSize: '13px', cursor: 'pointer', padding: '8px', marginTop: '4px' },
  main: { flex: 1 },
  mainTitle: { fontSize: '16px', fontWeight: '700', color: '#b6c2cf', marginBottom: '24px' },
  wsSection: { marginBottom: '40px' },
  wsHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  wsIconLg: { width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '15px', fontWeight: '700' },
  wsTitle: { fontSize: '16px', fontWeight: '600', color: '#b6c2cf' },
  boardsGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  boardCard: { width: '180px', height: '96px', borderRadius: '8px', border: 'none', cursor: 'pointer', padding: '10px', textAlign: 'left', position: 'relative', transition: 'filter 0.15s' },
  boardCardName: { color: 'white', fontWeight: '700', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.4)' },
  addBoardBtn: { width: '180px', height: '96px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: '#b6c2cf', fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s' },
  newBoardForm: { width: '180px', background: '#282e33', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  newBoardInput: { padding: '8px', borderRadius: '4px', border: '2px solid #579dff', background: '#22272b', color: 'white', fontSize: '14px', outline: 'none' },
  colorPicker: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  colorDot: { width: '20px', height: '20px', borderRadius: '4px', border: 'none', cursor: 'pointer' },
  createBtn: { background: '#579dff', color: '#1d2125', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { background: 'rgba(255,255,255,0.1)', color: '#b6c2cf', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 },
  modal: { background: '#282e33', borderRadius: '12px', padding: '24px', width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' },
  modalTitle: { color: '#b6c2cf', fontSize: '16px', fontWeight: '600' },
  modalInput: { padding: '10px', borderRadius: '4px', border: '2px solid #579dff', background: '#22272b', color: 'white', fontSize: '14px', outline: 'none' },
}
