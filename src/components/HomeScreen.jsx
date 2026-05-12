import { useState } from 'react'
import { Wrench, Moon, Sun } from 'lucide-react'

const TOOLS = [
  {
    id: 'math_formulas',
    icon: '📐',
    title: 'গণিত সূত্র',
    description: 'জ্যামিতি · বীজগণিত · সেট · সম্ভাবনা — সম্পূর্ণ সূত্র সংকলন',
  },
]

export default function HomeScreen({ onOpen }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Wrench size={22} color="var(--accent)" />
          <span style={styles.logoText}>Utility Kit</span>
        </div>
        <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Your Utility Learning Kit</h1>
          <p style={styles.subtitle}>Interactive tools to practise and sharpen everyday skills</p>
        </div>

        {TOOLS.length === 0 ? (
          <div style={styles.empty}>
            <Wrench size={48} color="var(--border-bright)" />
            <p style={styles.emptyText}>No tools yet — they will appear here as we build them.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {TOOLS.map(tool => (
              <button key={tool.id} onClick={() => onOpen(tool.id)} style={styles.card}>
                <span style={styles.cardIcon}>{tool.icon}</span>
                <span style={styles.cardTitle}>{tool.title}</span>
                <span style={styles.cardDesc}>{tool.description}</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-glass)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: 'var(--text)',
  },
  themeBtn: {
    background: 'var(--elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '7px 10px',
    color: 'var(--text-3)',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    gap: 40,
  },
  hero: {
    textAlign: 'center',
    maxWidth: 560,
  },
  title: {
    fontSize: 'clamp(28px, 5vw, 42px)',
    marginBottom: 12,
    background: 'var(--grad-brand)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: 17,
    color: 'var(--text-3)',
    lineHeight: 1.6,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '64px 24px',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius-xl)',
    maxWidth: 420,
    width: '100%',
  },
  emptyText: {
    color: 'var(--text-3)',
    textAlign: 'center',
    fontSize: 15,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    width: '100%',
    maxWidth: 960,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
  },
  cardIcon: {
    fontSize: 36,
    lineHeight: 1,
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 17,
    color: 'var(--text)',
  },
  cardDesc: {
    fontSize: 13,
    color: 'var(--text-3)',
    lineHeight: 1.5,
  },
}
