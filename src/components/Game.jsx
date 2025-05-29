import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function Game() {
  const [dealerHand, setDealerHand] = useState([])
  const [dealerHiddenCard, setDealerHiddenCard] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [deckId, setDeckId] = useState(null)
  const [gameStatus, setGameStatus] = useState('')
  const [consecutiveWins, setConsecutiveWins] = useState(0)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    initializeDeck()
  }, [])

  const initializeDeck = async () => {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      const data = await response.json()
      setDeckId(data.deck_id)
    } catch (error) {
      console.error('Error initializing deck:', error)
    }
  }

  const drawCards = async (count) => {
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
      const data = await response.json()
      return data.cards
    } catch (error) {
      console.error('Error drawing cards:', error)
      return []
    }
  }

  const calculateHandValue = (hand) => {
    let value = 0
    let aces = 0
    
    hand.forEach(card => {
      if (card.value === 'ACE') {
        aces += 1
      } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
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

  const startGame = async () => {
    if (!deckId) {
      await initializeDeck()
    }
    
    const playerCards = await drawCards(2)
    const dealerCards = await drawCards(2)
    
    setPlayerHand(playerCards)
    setDealerHand([dealerCards[0]])
    setDealerHiddenCard(dealerCards[1])
    setGameStatus('playing')
  }

  const hit = async () => {
    const newCard = await drawCards(1)
    const newPlayerHand = [...playerHand, ...newCard]
    setPlayerHand(newPlayerHand)
    
    const value = calculateHandValue(newPlayerHand)
    if (value > 21) {
      endGame('dealer')
    }
  }

  const stand = async () => {
    // Reveal dealer's hidden card
    const currentDealerHand = [...dealerHand, dealerHiddenCard]
    setDealerHand(currentDealerHand)
    setDealerHiddenCard(null)
    
    let finalDealerHand = [...currentDealerHand]
    
    while (calculateHandValue(finalDealerHand) < 17) {
      const newCard = await drawCards(1)
      finalDealerHand = [...finalDealerHand, ...newCard]
    }
    
    setDealerHand(finalDealerHand)
    
    const playerValue = calculateHandValue(playerHand)
    const dealerValue = calculateHandValue(finalDealerHand)
    
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
          ], {
            onConflict: 'user_id',
            returning: 'minimal'
          })
        
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
              <div key={index} className="h-32 w-24 rounded-lg bg-white p-4">
                <img src={card.image} alt={`${card.value} of ${card.suit}`} className="h-full w-full object-contain" />
              </div>
            ))}
            {dealerHiddenCard && (
              <div className="h-32 w-24 rounded-lg bg-white p-4">
                <img src="https://deckofcardsapi.com/static/img/back.png" alt="Card back" className="h-full w-full object-contain" />
              </div>
            )}
          </div>
          <p className="mt-2 text-white">
            Total: {dealerHiddenCard ? calculateHandValue(dealerHand) + ' + ?' : calculateHandValue(dealerHand)}
          </p>
        </div>

        <div className="rounded-lg bg-green-900 p-6">
          <h2 className="mb-4 text-xl text-white">Your Hand</h2>
          <div className="flex space-x-4">
            {playerHand.map((card, index) => (
              <div key={index} className="h-32 w-24 rounded-lg bg-white p-4">
                <img src={card.image} alt={`${card.value} of ${card.suit}`} className="h-full w-full object-contain" />
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