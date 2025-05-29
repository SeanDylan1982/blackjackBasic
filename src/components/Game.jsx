import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function Game() {
  const [dealerHand, setDealerHand] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [deck, setDeck] = useState([])
  const [gameStatus, setGameStatus] = useState('')
  const [consecutiveWins, setConsecutiveWins] = useState(0)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    initializeDeck()
  }, [])

  const initializeDeck = () => {
    const suits = ['H', 'D', 'C', 'S']
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const newDeck = suits.flatMap(suit => 
      values.map(value => ({ suit, value }))
    )
    setDeck(shuffle(newDeck))
  }

  const shuffle = (array) => {
    const shuffled = [...array]
    let currentIndex = shuffled.length
    
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      
      // Use temporary variable for swapping
      const temp = shuffled[currentIndex]
      shuffled[currentIndex] = shuffled[randomIndex]
      shuffled[randomIndex] = temp
    }
    
    return shuffled
  }

  const calculateHandValue = (hand) => {
    let value = 0
    let aces = 0
    
    hand.forEach(card => {
      if (card.value === 'A') {
        aces += 1
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        value += 10
      } else {
        value += parseInt(card.value)
      }
    })

    for (let i = 0; i < aces; i++) {
      if (value + 11 <= 21) {
        value += 11
      } else {
        value += 1
      }
    }

    return value
  }

  const dealCard = () => {
    const newDeck = [...deck]
    const card = newDeck.pop()
    setDeck(newDeck)
    return card
  }

  const startGame = () => {
    const playerCards = [dealCard(), dealCard()]
    const dealerCards = [dealCard()]
    
    setPlayerHand(playerCards)
    setDealerHand(dealerCards)
    setGameStatus('playing')
  }

  const hit = () => {
    const newPlayerHand = [...playerHand, dealCard()]
    setPlayerHand(newPlayerHand)
    
    const value = calculateHandValue(newPlayerHand)
    if (value > 21) {
      endGame('dealer')
    }
  }

  const stand = async () => {
    let currentDealerHand = [...dealerHand]
    
    while (calculateHandValue(currentDealerHand) < 17) {
      currentDealerHand.push(dealCard())
    }
    
    setDealerHand(currentDealerHand)
    
    const playerValue = calculateHandValue(playerHand)
    const dealerValue = calculateHandValue(currentDealerHand)
    
    if (dealerValue > 21 || playerValue > dealerValue) {
      endGame('player')
    } else if (dealerValue > playerValue) {
      endGame('dealer')
    } else {
      endGame('tie')
    }
  }

  const endGame = async (winner) => {
    setGameStatus(winner)
    
    if (winner === 'player') {
      const newConsecutiveWins = consecutiveWins + 1
      setConsecutiveWins(newConsecutiveWins)
      
      try {
        const { error } = await supabase
          .from('leaderboard')
          .upsert([
            {
              user_id: user.id,
              consecutive_wins: newConsecutiveWins,
              email: user.email
            }
          ])
        
        if (error) throw error
      } catch (error) {
        console.error('Error updating leaderboard:', error.message)
      }
    } else {
      setConsecutiveWins(0)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-green-800 p-8">
      <div className="mb-8 flex justify-between">
        <h1 className="text-4xl font-bold text-white">BlackJack</h1>
        <div>
          <span className="mr-4 text-white">Consecutive Wins: {consecutiveWins}</span>
          <button
            onClick={() => navigate('/leaderboard')}
            className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Leaderboard
          </button>
          <button
            onClick={handleSignOut}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg bg-green-900 p-6">
          <h2 className="mb-4 text-xl text-white">Dealer's Hand</h2>
          <div className="flex space-x-4">
            {dealerHand.map((card, index) => (
              <div key={index} className="h-32 w-24 rounded-lg bg-white p-4 text-center">
                {card.value} {card.suit}
              </div>
            ))}
          </div>
          <p className="mt-2 text-white">
            Total: {gameStatus === 'playing' ? '?' : calculateHandValue(dealerHand)}
          </p>
        </div>

        <div className="rounded-lg bg-green-900 p-6">
          <h2 className="mb-4 text-xl text-white">Your Hand</h2>
          <div className="flex space-x-4">
            {playerHand.map((card, index) => (
              <div key={index} className="h-32 w-24 rounded-lg bg-white p-4 text-center">
                {card.value} {card.suit}
              </div>
            ))}
          </div>
          <p className="mt-2 text-white">Total: {calculateHandValue(playerHand)}</p>
        </div>

        <div className="flex space-x-4">
          {gameStatus === 'playing' ? (
            <>
              <button
                onClick={hit}
                className="rounded bg-red-500 px-8 py-3 font-bold text-white hover:bg-red-600"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="rounded bg-yellow-500 px-8 py-3 font-bold text-white hover:bg-yellow-600"
              >
                Stand
              </button>
            </>
          ) : (
            <button
              onClick={startGame}
              className="rounded bg-green-500 px-8 py-3 font-bold text-white hover:bg-green-600"
            >
              Deal
            </button>
          )}
        </div>

        {gameStatus && gameStatus !== 'playing' && (
          <div className="mt-4 text-center text-2xl font-bold text-white">
            {gameStatus === 'player'
              ? 'You Win!'
              : gameStatus === 'dealer'
              ? 'Dealer Wins!'
              : 'Push!'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Game