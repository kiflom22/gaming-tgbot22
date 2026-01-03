import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { playGame } from '../api'

export default function Crash({ balance, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [gameActive, setGameActive] = useState(false)
  const [multiplier, setMultiplier] = useState(1.00)
  const [crashed, setCrashed] = useState(false)
  const [cashedOut, setCashedOut] = useState(false)
  const [result, setResult] = useState(null)
  const [crashPoint, setCrashPoint] = useState(null)
  const intervalRef = useRef(null)

  const generateCrashPoint = () => {
    // TIERED DIFFICULTY ALGORITHM based on bet amount (same as Limbo)
    const rand = Math.random() * 100
    let crashPoint
    
    // HIGH BET (1000+): NIGHTMARE MODE - 33% crash between 1.0x-1.4x
    if (betAmount >= 1000 && rand < 33) {
      return 1.00 + Math.random() * 0.40 // Crash between 1.00x - 1.40x
    }
    // MEDIUM BET (500-999): HARD MODE - 15% crash between 1.0x-1.5x
    else if (betAmount >= 500 && betAmount < 1000 && rand < 15) {
      return 1.00 + Math.random() * 0.50 // Crash between 1.00x - 1.50x
    }
    // LOW BET (<500): AVERAGE MODE - More balanced
    else if (betAmount < 500) {
      // 5% instant crash at 1.00x
      if (rand < 5) {
        return 1.00
      }
      // 45% crash between 1.01x - 2.00x
      else if (rand < 50) {
        return 1.01 + Math.random() * 0.99
      }
      // 25% crash between 2.00x - 3.00x
      else if (rand < 75) {
        return 2.00 + Math.random() * 1.00
      }
      // 15% crash between 3.00x - 5.00x
      else if (rand < 90) {
        return 3.00 + Math.random() * 2.00
      }
      // 7% crash between 5.00x - 10.00x
      else if (rand < 97) {
        return 5.00 + Math.random() * 5.00
      }
      // 3% crash between 10.00x - 50.00x
      else {
        return 10.00 + Math.random() * 40.00
      }
    }
    // FALLBACK for medium/high bets that didn't hit special condition
    else {
      // 7% instant crash at 1.00x
      if (rand < 7) {
        return 1.00
      }
      // 78% crash between 1.01x - 2.00x
      else if (rand < 85) {
        return 1.01 + Math.random() * 0.99
      }
      // 10% crash between 2.00x - 3.00x
      else if (rand < 95) {
        return 2.00 + Math.random() * 1.00
      }
      // 3% crash between 3.00x - 5.00x
      else if (rand < 98) {
        return 3.00 + Math.random() * 2.00
      }
      // 1.5% crash between 5.00x - 10.00x
      else if (rand < 99.5) {
        return 5.00 + Math.random() * 5.00
      }
      // 0.5% crash between 10.00x - 50.00x
      else {
        return 10.00 + Math.random() * 40.00
      }
    }
  }

  const startGame = () => {
    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount')
      return
    }

    if (balance < betAmount) {
      toast.error('Insufficient balance! Please add points to play.')
      return
    }

    setGameActive(true)
    setMultiplier(1.00)
    setCrashed(false)
    setCashedOut(false)
    setResult(null)
    
    const crash = generateCrashPoint()
    setCrashPoint(crash)

    let currentMultiplier = 1.00
    intervalRef.current = setInterval(() => {
      currentMultiplier += 0.01
      setMultiplier(Math.round(currentMultiplier * 100) / 100)

      if (currentMultiplier >= crash) {
        clearInterval(intervalRef.current)
        setCrashed(true)
        setGameActive(false)
        handleCrash()
      }
    }, 50) // Update every 50ms for smooth animation
  }

  const cashOut = async () => {
    if (!gameActive || cashedOut || crashed) return

    clearInterval(intervalRef.current)
    setCashedOut(true)
    setGameActive(false)

    const winAmount = betAmount * multiplier

    const res = await playGame('crash', betAmount, {
      multiplier: multiplier,
      crash_point: crashPoint,
      cashed_out: true
    })

    if (res?.error) {
      toast.error(res.error)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      setResult({
        won: true,
        amount: winAmount - betAmount,
        multiplier: multiplier
      })
    }
  }

  const handleCrash = async () => {
    const res = await playGame('crash', betAmount, {
      multiplier: crashPoint,
      crash_point: crashPoint,
      cashed_out: false
    })

    if (res?.error) {
      toast.error(res.error)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      setResult({
        won: false,
        amount: betAmount,
        multiplier: crashPoint
      })
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">🐦 Crash</h2>
      
      <div className="game-container">
        {/* Multiplier Display */}
        <div className="relative h-64 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${
                crashed ? '#ef4444' : cashedOut ? '#22c55e' : '#3b82f6'
              } 0%, transparent 70%)`
            }}
            animate={{
              scale: gameActive ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: gameActive ? Infinity : 0,
            }}
          />

          {/* Multiplier Text */}
          <motion.div
            className="relative z-10 text-center"
            animate={{
              scale: gameActive ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: gameActive ? Infinity : 0,
            }}
          >
            <div className={`text-7xl font-black ${
              crashed ? 'text-red-500' : cashedOut ? 'text-green-400' : 'text-white'
            }`}>
              {crashed ? '💀' : cashedOut ? '✅' : '🐦'}
            </div>
            <div className={`text-6xl font-black mt-4 ${
              crashed ? 'text-red-500' : cashedOut ? 'text-green-400' : 'text-cyan-400'
            }`}>
              {multiplier.toFixed(2)}x
            </div>
            {crashed && (
              <div className="text-xl text-red-400 mt-2">
                Crashed at {crashPoint?.toFixed(2)}x
              </div>
            )}
            {cashedOut && (
              <div className="text-xl text-green-400 mt-2">
                Cashed out!
              </div>
            )}
          </motion.div>

          {/* Rocket Trail Effect */}
          {gameActive && !crashed && (
            <motion.div
              className="absolute bottom-0 left-1/2 w-2 bg-gradient-to-t from-cyan-400 to-transparent"
              style={{ height: '100%' }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Bet Amount</label>
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            min="1"
            className="input-field"
            disabled={gameActive}
          />
        </div>

        {/* Buttons */}
        {!gameActive ? (
          <>
            <button
              className="btn btn-primary w-full"
              onClick={startGame}
              disabled={balance < betAmount || betAmount <= 0}
            >
              {balance < betAmount ? '💰 Insufficient Balance' : result ? 'Play Again' : '🐦 Start Game'}
            </button>

            {balance < betAmount && betAmount > 0 && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-center">
                <p className="text-sm text-red-700 font-semibold">
                  ⚠️ You need {betAmount} points but only have {balance.toFixed(2)} points
                </p>
              </div>
            )}
          </>
        ) : (
          <button
            className="btn btn-success w-full"
            onClick={cashOut}
            disabled={crashed || cashedOut}
          >
            💰 Cash Out ({(betAmount * multiplier).toFixed(2)} pts)
          </button>
        )}

        {/* Result */}
        {result && (
          <motion.div 
            className={`text-center p-5 rounded-xl mt-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-2">
              {result.won ? '🎉 Cashed Out!' : '💥 Crashed!'}
            </h3>
            <p className="text-xl mb-1">
              {result.won ? `${result.multiplier.toFixed(2)}x` : `${result.multiplier.toFixed(2)}x`}
            </p>
            <p className={`text-lg ${result.won ? 'text-green-400' : 'text-red-400'}`}>
              {result.won ? '+' : '-'}{result.amount.toFixed(2)} points
            </p>
          </motion.div>
        )}

        {/* Game Info */}
        <div className="mt-6 p-4 bg-dark-800/50 rounded-lg text-sm">
          <h4 className="font-bold mb-2">How to Play:</h4>
          <ul className="space-y-1 text-gray-300">
            <li>• Watch the bird fly higher (multiplier increases)</li>
            <li>• Cash out before the bird crashes!</li>
            <li>• The longer you wait, the higher the multiplier</li>
            <li>• But it can crash at any moment!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
