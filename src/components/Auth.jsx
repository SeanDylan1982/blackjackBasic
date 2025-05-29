import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signIn({ email, password })
      } else {
        await signUp({ email, password })
      }
      navigate('/game')
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-10">
        <h2 className="text-center text-3xl font-bold">
          {isLogin ? 'Sign In' : 'Sign Up'} to Play BlackJack
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 p-3 font-bold text-white hover:bg-green-700"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-white"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  )
}

export default Auth