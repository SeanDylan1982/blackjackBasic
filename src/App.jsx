import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/Game'
import Auth from './components/Auth'
import Leaderboard from './components/Leaderboard'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App