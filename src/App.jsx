import { useState } from 'react'
import HomeScreen   from './components/HomeScreen'
import MathFormulas from './components/MathFormulas'

function App() {
  const [screen, setScreen]           = useState('home')
  const [activeToolId, setActiveToolId] = useState(null)

  const openTool = (id) => { setActiveToolId(id); setScreen('tool') }
  const goHome   = () => { setActiveToolId(null); setScreen('home') }

  return (
    <div id="app">
      {screen === 'home' && <HomeScreen onOpen={openTool} />}
      {screen === 'tool' && activeToolId === 'math_formulas' && <MathFormulas onBack={goHome} />}
    </div>
  )
}

export default App
