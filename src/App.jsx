import { useState } from 'react'
import './App.css'
import MonopolyGame from './monopoly/index.js'

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">大富翁控制台遊戲</h1>
      <p className="mb-4">這個遊戲目前在Chrome控制台中運行</p>
      <p className="text-lg">請按 F12 或右鍵選擇「檢查」開啟開發者工具</p>
      <p className="text-lg">然後切換到「控制台」標籤開始遊戲</p>
      <div className="mt-8 p-4 bg-gray-200 rounded-lg">
        <h2 className="text-xl font-bold mb-2">基本指令：</h2>
        <pre className="font-mono bg-gray-800 text-green-400 p-4 rounded">
          MonopolyGame.initGame()     // 初始化遊戲
          MonopolyGame.addPlayer('名稱') // 新增玩家
          MonopolyGame.startGame()    // 開始遊戲
          MonopolyGame.rollAndMove()  // 擲骰子並移動
          MonopolyGame.status()       // 顯示遊戲狀態
          MonopolyGame.help()         // 顯示說明
        </pre>
      </div>
    </div>
  )
}

export default App
