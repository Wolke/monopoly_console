import './App.css'
import MonopolyGame from './monopoly/index.js'
import MonopolyApp from './components/MonopolyApp'

// 確保 MonopolyGame 在全域可用 (保留控制台功能)
window.MonopolyGame = MonopolyGame;

function App() {
  return (
    <>
      {/* 手機版 Web UI */}
      <MonopolyApp />
    </>
  )
}

export default App
