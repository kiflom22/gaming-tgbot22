import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

export default function Dice({ balance, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [target, setTarget] = useState(50)
  const [prediction, setPrediction] = useState('over') // 'over' or 'under'
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null)
  const [diceNumber, setDiceNumber] = useState(50)
  const [history, setHistory] = useState([])

  // Calculate win chance and multiplier
  const winChance = prediction === 'over' ? (100 - target) : target
  const multiplier = (98 / winChance).toFixed(2) // 98% RTP (2% house edge)

  const roll = async () => {
    if (rolling) return

    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount')
      return
    }

    if (balance < betAmount) {
      toast.error('Insufficient balance! Please add points to play.')
      return
    }

    setRolling(true)
    setResult(null)

    // Animate rolling
    const rollInterval = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 100))
    }, 50)

    // Wait for animation
    await new Promise(r => setTimeout(r, 1500))
    clearInterval(rollInterval)

    // Generate final number (server-side would do this)
    const finalNumber = Math.floor(Math.random() * 100)
    setDiceNumber(finalNumber)

    // Determine win/loss
    const won = prediction === 'over' 
      ? finalNumber > target 
      : finalNumber < target

    const winAmount = won ? betAmount * parseFloat(multiplier) : 0

    // API call
    const res = await playGame('dice', betAmount, {
      target: target,
      prediction: prediction,
      roll: finalNumber,
      won: won,
      multiplier: parseFloat(multiplier)
    })

    if (res?.error) {
      toast.error(res.error)
      setRolling(false)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      
      const gameResult = {
        won,
        amount: won ? winAmount - betAmount : betAmount,
        roll: finalNumber,
        target,
        prediction
      }
      
      setResult(gameResult)
      setHistory([gameResult, ...history.slice(0, 9)]) // Keep last 10
    }

    setRolling(false)
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">🎲 Dice</h2>
      
      <div className="game-container">
        {/* Dice Display */}
        <div className="relative h-64 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
          {/* Background Effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${
                result?.won ? '#22c55e' : result?.won === false ? '#ef4444' : '#3b82f6'
              } 0%, transparent 70%)`
            }}
            animate={{
              scale: rolling ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: rolling ? Infinity : 0,
            }}
          />

          {/* Dice Number */}
          <div className="relative z-10 text-center">
            <motion.div
              className="text-8xl font-black"
              animate={{
                scale: rolling ? [1, 1.1, 1] : 1,
                rotate: rolling ? [0, 360] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: rolling ? Infinity : 0,
              }}
            >
              <span className={`${
                result?.won ? 'text-green-400' : 
                result?.won === false ? 'text-red-400' : 
                'text-cyan-400'
              }`}>
                {diceNumber}
              </span>
            </motion.div>
            
            {/* Target Line Indicator */}
            <div className="mt-4 text-sm text-gray-400">
              Target: {prediction === 'over' ? '>' : '<'} {target}
            </div>
          </div>

          {/* Visual Target Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${target}%` }}
            />
          </div>
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
              disabled={rolling}
            />
          </div>

          {/* Target Number */}
          <div>
            <label className="block text-sm mb-2">
              Target Number: {target}
            </label>
            <input 
              type="range" 
              value={target}
              onChange={e => setTarget(Number(e.target.value))}
              min="1"
              max="99"
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              disabled={rolling}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>50</span>
              <span>99</span>
            </div>
          </div>

          {/* Prediction Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`py-3 rounded-lg font-bold transition-all ${
                prediction === 'under'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
              onClick={() => setPrediction('under')}
              disabled={rolling}
            >
              <div className="text-2xl mb-1">⬇️</div>
              <div className="text-sm">Roll Under</div>
              <div className="text-xs mt-1">{target}% chance</div>
            </button>
            <button
              className={`py-3 rounded-lg font-bold transition-all ${
                prediction === 'over'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
              onClick={() => setPrediction('over')}
              disabled={rolling}
            >
              <div className="text-2xl mb-1">⬆️</div>
              <div className="text-sm">Roll Over</div>
              <div className="text-xs mt-1">{100 - target}% chance</div>
            </button>
          </div>

          {/* Win Info */}
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-400">Win Chance: {winChance}%</div>
            <div className="text-lg font-bold text-cyan-400">
              Multiplier: {multiplier}x
            </div>
            <div className="text-sm text-green-400">
              Potential Win: {(betAmount * parseFloat(multiplier)).toFixed(2)} pts
            </div>
          </div>
        </div>

        {/* Roll Button */}
        <button
          className="btn btn-primary w-full mb-4"
          onClick={roll}
          disabled={rolling || balance < betAmount || betAmount <= 0}
        >
          {rolling ? '🎲 Rolling...' : balance < betAmount ? '💰 Insufficient Balance' : '🎲 Roll Dice'}
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
                {result.won ? '🎉 You Won!' : '😢 You Lost!'}
              </h3>
              <p className="text-xl mb-1">
                Rolled: {result.roll} ({result.prediction} {result.target})
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
            <h4 className="font-bold mb-3 text-sm">Recent Rolls</h4>
            <div className="flex gap-2 flex-wrap">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg text-sm font-bold ${
                    h.won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {h.roll}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Info */}
        <div className="mt-4 p-4 bg-dark-800/50 rounded-lg text-sm">
          <h4 className="font-bold mb-2">How to Play:</h4>
          <ul className="space-y-1 text-gray-300">
            <li>• Set your target number (1-99)</li>
            <li>• Choose "Roll Over" or "Roll Under"</li>
            <li>• Higher risk = Higher multiplier</li>
            <li>• 50/50 gives ~2x multiplier</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
