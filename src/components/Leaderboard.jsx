import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaderboard()
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'leaderboard' 
        }, 
        () => {
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('consecutive_wins', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching leaderboard:', error)
    } else {
      setLeaders(data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8 flex justify-between">
        <h1 className="text-4xl font-bold text-white">Top 10 Win Streaks</h1>
        <button
          onClick={() => navigate('/game')}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Back to Game
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-800">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="bg-gray-700 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Rank
              </th>
              <th className="bg-gray-700 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Player
              </th>
              <th className="bg-gray-700 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Win Streak
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaders.map((leader, index) => (
              <tr key={leader.user_id} className={index === 0 ? 'bg-yellow-900 bg-opacity-20' : ''}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                  {leader.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                  {leader.consecutive_wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leaderboard