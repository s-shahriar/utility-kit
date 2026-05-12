import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import HomeScreen      from './components/HomeScreen'
import MathFormulas    from './components/MathFormulas'
import FinancialTerms  from './components/FinancialTerms'

export default function App() {
  const [screen, setScreen]             = useState('home')
  const [activeToolId, setActiveToolId] = useState(null)
  const [theme, setTheme]               = useState(
    () => localStorage.getItem('utility-theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('utility-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const openTool    = (id) => { setActiveToolId(id); setScreen('tool') }
  const goHome      = () => { setActiveToolId(null); setScreen('home') }

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-aurora" />
        <div className="bg-grid" />
      </div>

      {/* Theme toggle only on home screen — matches ICT quiz behaviour */}
      {screen === 'home' && (
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      )}

      {screen === 'home' && <HomeScreen onOpen={openTool} />}
      {screen === 'tool' && activeToolId === 'math_formulas'   && <MathFormulas   onBack={goHome} />}
      {screen === 'tool' && activeToolId === 'financial_terms' && <FinancialTerms  onBack={goHome} />}
    </div>
  )
}
