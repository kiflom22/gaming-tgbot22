import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

export default function Limbo({ balance, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [targetMultiplier, setTargetMultiplier] = useState(2.00)
  const [playing, setPlaying] = useState(false)
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)

  // Calculate win chance based on target
  const winChance = ((98 / targetMultiplier)).toFixed(2) // 98% RTP

  const play = async () => {
    if (playing) return

    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount')
      return
    }

    if (balance < betAmount) {
      toast.error('Insufficient balance! Please add points to play.')
      return
    }

    if (targetMultiplier < 1.01) {
      toast.error('Target must be at least 1.01x')
      return
    }

    setPlaying(true)
    setResult(null)
    setCurrentMultiplier(1.00)

    // Generate crash point (server would do this)
    // TIERED DIFFICULTY ALGORITHM based on bet amount
    const rand = Math.random() * 100
    let crashPoint
    
    // HIGH BET (1000+): NIGHTMARE MODE - 33% crash between 1.0x-1.4x
    if (betAmount >= 1000 && rand < 33) {
      crashPoint = 1.00 + Math.random() * 0.40 // Crash between 1.00x - 1.40x
    }
    // MEDIUM BET (500-999): HARD MODE - 15% crash between 1.0x-1.5x
    else if (betAmount >= 500 && betAmount < 1000 && rand < 15) {
      crashPoint = 1.00 + Math.random() * 0.50 // Crash between 1.00x - 1.50x
    }
    // LOW BET (<500): AVERAGE MODE - More balanced
    else if (betAmount < 500) {
      // 5% instant crash at 1.00x
      if (rand < 5) {
        crashPoint = 1.00
      }
      // 45% crash between 1.01x - 2.00x
      else if (rand < 50) {
        crashPoint = 1.01 + Math.random() * 0.99
      }
      // 25% crash between 2.00x - 3.00x
      else if (rand < 75) {
        crashPoint = 2.00 + Math.random() * 1.00
      }
      // 15% crash between 3.00x - 5.00x
      else if (rand < 90) {
        crashPoint = 3.00 + Math.random() * 2.00
      }
      // 7% crash between 5.00x - 10.00x
      else if (rand < 97) {
        crashPoint = 5.00 + Math.random() * 5.00
      }
      // 3% crash between 10.00x - 50.00x
      else {
        crashPoint = 10.00 + Math.random() * 40.00
      }
    }
    // FALLBACK for medium/high bets that didn't hit special condition
    else {
      // 7% instant crash at 1.00x
      if (rand < 7) {
        crashPoint = 1.00
      }
      // 78% crash between 1.01x - 2.00x
      else if (rand < 85) {
        crashPoint = 1.01 + Math.random() * 0.99
      }
      // 10% crash between 2.00x - 3.00x
      else if (rand < 95) {
        crashPoint = 2.00 + Math.random() * 1.00
      }
      // 3% crash between 3.00x - 5.00x
      else if (rand < 98) {
        crashPoint = 3.00 + Math.random() * 2.00
      }
      // 1.5% crash between 5.00x - 10.00x
      else if (rand < 99.5) {
        crashPoint = 5.00 + Math.random() * 5.00
      }
      // 0.5% crash between 10.00x - 50.00x
      else {
        crashPoint = 10.00 + Math.random() * 40.00
      }
    }

    // Animate the bar rising
    let current = 1.00
    const speed = 0.02
    
    intervalRef.current = setInterval(() => {
      current += speed
      setCurrentMultiplier(Math.round(current * 100) / 100)

      if (current >= crashPoint) {
        clearInterval(intervalRef.current)
        finishGame(crashPoint, false)
      } else if (current >= targetMultiplier) {
        clearInterval(intervalRef.current)
        finishGame(crashPoint, true)
      }
    }, 30)
  }

  const finishGame = async (crashPoint, won) => {
    setPlaying(false)
    
    const winAmount = won ? betAmount * targetMultiplier : 0

    const res = await playGame('limbo', betAmount, {
      target: targetMultiplier,
      crash_point: crashPoint,
      won: won,
      multiplier: won ? targetMultiplier : 0
    })

    if (res?.error) {
      toast.error(res.error)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      
      const gameResult = {
        won,
        amount: won ? winAmount - betAmount : betAmount,
        crashPoint: crashPoint,
        target: targetMultiplier
      }
      
      setResult(gameResult)
      setHistory([gameResult, ...history.slice(0, 9)])
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const quickSetMultiplier = (value) => {
    setTargetMultiplier(value)
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">📊 Limbo</h2>
      
      <div className="game-container">
        {/* Limbo Bar Display */}
        <div className="relative h-80 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl mb-6 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[10%] border-b border-gray-600" />
            ))}
          </div>

          {/* Rising Bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-300"
            style={{
              height: `${Math.min((currentMultiplier / Math.max(targetMultiplier, 10)) * 100, 100)}%`,
              opacity: 0.3
            }}
            animate={{
              opacity: playing ? [0.3, 0.5, 0.3] : 0.3
            }}
            transition={{
              duration: 1,
              repeat: playing ? Infinity : 0
            }}
          />

          {/* Target Line */}
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10"
            style={{
              bottom: `${Math.min((targetMultiplier / Math.max(targetMultiplier, 10)) * 100, 100)}%`
            }}
          >
            <div className="absolute right-2 -top-3 text-xs font-bold text-yellow-400 bg-dark-900 px-2 py-1 rounded">
              Target: {targetMultiplier.toFixed(2)}x
            </div>
          </div>

          {/* Current Multiplier Display */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              className="text-center"
              animate={{
                scale: playing ? [1, 1.05, 1] : 1
              }}
              transition={{
                duration: 0.5,
                repeat: playing ? Infinity : 0
              }}
            >
              <div className={`text-7xl font-black ${
                result?.won ? 'text-green-400' : 
                result?.won === false ? 'text-red-400' : 
                'text-cyan-400'
              }`}>
                {currentMultiplier.toFixed(2)}x
              </div>
              {result && (
                <div className={`text-xl mt-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? '✅ WIN!' : '💥 BUST!'}
                </div>
              )}
            </motion.div>
          </div>

          {/* Crash Point Indicator (after game) */}
          {result && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
              style={{
                bottom: `${Math.min((result.crashPoint / Math.max(targetMultiplier, 10)) * 100, 100)}%`
              }}
            >
              <div className="absolute right-2 -top-3 text-xs font-bold text-red-400 bg-dark-900 px-2 py-1 rounded">
                Crashed: {result.crashPoint.toFixed(2)}x
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-4">
          {/* Bet Amount */}
          <div>
            <label className="block text-sm mb-2">Bet Amount</label>
            <input 
              type="number" 
              value={betAmount}
              onChange={e => setBetAmount(Number(e.target.value))}
              min="1"
              className="input-field"
              disabled={playing}
            />
          </div>

          {/* Target Multiplier */}
          <div>
            <label className="block text-sm mb-2">
              Target Multiplier: {targetMultiplier.toFixed(2)}x
            </label>
            <input 
              type="range" 
              value={targetMultiplier}
              onChange={e => setTargetMultiplier(Number(e.target.value))}
              min="1.01"
              max="100"
              step="0.01"
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              disabled={playing}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1.01x</span>
              <span>50x</span>
              <span>100x</span>
            </div>
          </div>

          {/* Quick Set Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1.5, 2, 5, 10].map(val => (
              <button
                key={val}
                className="py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-bold transition-all"
                onClick={() => quickSetMultiplier(val)}
                disabled={playing}
              >
                {val}x
              </button>
            ))}
          </div>

          {/* Win Info */}
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-400">Win Chance: {winChance}%</div>
            <div className="text-lg font-bold text-cyan-400">
              Payout: {targetMultiplier.toFixed(2)}x
            </div>
            <div className="text-sm text-green-400">
              Potential Win: {(betAmount * targetMultiplier).toFixed(2)} pts
            </div>
          </div>
        </div>

        {/* Play Button */}
        <button
          className="btn btn-primary w-full mb-4"
          onClick={play}
          disabled={playing || balance < betAmount || betAmount <= 0}
        >
          {playing ? '📊 Playing...' : balance < betAmount ? '💰 Insufficient Balance' : '📊 Play Limbo'}
        </button>

        {balance < betAmount && betAmount > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-center">
            <p className="text-sm text-red-700 font-semibold">
              ⚠️ You need {betAmount} points but only have {balance.toFixed(2)} points
            </p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div 
              className={`text-center p-5 rounded-xl mb-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-2">
                {result.won ? '🎉 You Won!' : '💥 Busted!'}
              </h3>
              <p className="text-xl mb-1">
                Target: {result.target.toFixed(2)}x | Crashed: {result.crashPoint.toFixed(2)}x
              </p>
              <p className={`text-lg ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? '+' : '-'}{result.amount.toFixed(2)} points
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-dark-800/50 rounded-lg p-4">
            <h4 className="font-bold mb-3 text-sm">Recent Games</h4>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
                    h.won ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  <span className={h.won ? 'text-green-400' : 'text-red-400'}>
                    {h.won ? '✅' : '💥'} {h.crashPoint.toFixed(2)}x
                  </span>
                  <span className="text-gray-400">
                    Target: {h.target.toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Info */}
        <div className="mt-4 p-4 bg-dark-800/50 rounded-lg text-sm">
          <h4 className="font-bold mb-2">How to Play:</h4>
          <ul className="space-y-1 text-gray-300">
            <li>• Set your target multiplier</li>
            <li>• Watch the bar rise from 1.00x</li>
            <li>• If it reaches your target, you win!</li>
            <li>• Higher targets = bigger wins but lower chance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
