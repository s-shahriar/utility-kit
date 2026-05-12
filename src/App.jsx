import { useState } from 'react'
import HomeScreen from './components/HomeScreen'

function App() {
  const [screen, setScreen] = useState('home')
  const [activeToolId, setActiveToolId] = useState(null)

  const openTool = (id) => { setActiveToolId(id); setScreen('tool') }
  const goHome = () => { setActiveToolId(null); setScreen('home') }

  return (
    <div id="app">
      {screen === 'home' && <HomeScreen onOpen={openTool} />}
    </div>
  )
}

export default App
