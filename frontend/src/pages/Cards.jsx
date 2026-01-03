import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

const CARDS = ['🃏', '👸', '🤴'] // Joker, Queen, King

export default function Cards({ balance, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [gamePhase, setGamePhase] = useState('idle') // idle, showing, shuffling, picking, result
  const [cardPositions, setCardPositions] = useState([0, 1, 2])
  const [jokerPosition, setJokerPosition] = useState(-1) // Start with -1 (no joker set)
  const [selectedCard, setSelectedCard] = useState(null)
  const [revealedCards, setRevealedCards] = useState([])
  const [result, setResult] = useState(null)
  const [shuffleCount, setShuffleCount] = useState(0)

  const startGame = async () => {
    // Check if user has sufficient balance
    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount')
      return
    }

    if (betAmount > 200) {
      toast.error('Maximum bet is 200 points for this game')
      return
    }

    if (balance < betAmount) {
      toast.error('Insufficient balance! Please add points to play.')
      return
    }

    setResult(null)
    setSelectedCard(null)
    setRevealedCards([])
    setCardPositions([0, 1, 2])
    
    // Random joker position using crypto API for better randomness
    const randomArray = new Uint32Array(1)
    crypto.getRandomValues(randomArray)
    const jokerPos = randomArray[0] % 3
    setJokerPosition(jokerPos)
    
    // Show cards first
    setGamePhase('showing')
    setRevealedCards([0, 1, 2])
    
    await new Promise(r => setTimeout(r, 2000))
    
    // Hide cards
    setRevealedCards([])
    await new Promise(r => setTimeout(r, 500))
    
    // Sophisticated shuffle algorithm
    setGamePhase('shuffling')
    
    let positions = [0, 1, 2]
    
    // Use crypto random for number of shuffles (8-15 shuffles)
    const shuffleArray = new Uint32Array(1)
    crypto.getRandomValues(shuffleArray)
    const shuffles = 8 + (shuffleArray[0] % 8)
    
    // Advanced shuffle patterns
    const shufflePatterns = [
      // Pattern 1: Adjacent swaps
      () => {
        const idx = Math.floor(Math.random() * 2)
        return [idx, idx + 1]
      },
      // Pattern 2: Outer swap (0 and 2)
      () => [0, 2],
      // Pattern 3: Random swap
      () => {
        const idx1 = Math.floor(Math.random() * 3)
        let idx2 = Math.floor(Math.random() * 3)
        while (idx2 === idx1) idx2 = Math.floor(Math.random() * 3)
        return [idx1, idx2]
      },
      // Pattern 4: Rotate all positions
      () => {
        positions = [positions[2], positions[0], positions[1]]
        return null // Special case - already rotated
      },
      // Pattern 5: Reverse rotate
      () => {
        positions = [positions[1], positions[2], positions[0]]
        return null // Special case - already rotated
      }
    ]
    
    for (let i = 0; i < shuffles; i++) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 150)) // Variable timing
      
      // Pick random shuffle pattern
      const patternIndex = Math.floor(Math.random() * shufflePatterns.length)
      const swapIndices = shufflePatterns[patternIndex]()
      
      if (swapIndices) {
        // Standard swap
        const [idx1, idx2] = swapIndices
        const newPositions = [...positions]
        const temp = newPositions[idx1]
        newPositions[idx1] = newPositions[idx2]
        newPositions[idx2] = temp
        positions = newPositions
      }
      // else: rotation already applied
      
      setCardPositions([...positions])
      setShuffleCount(i + 1)
    }
    
    await new Promise(r => setTimeout(r, 300))
    setGamePhase('picking')
  }

  const pickCard = async (position) => {
    if (gamePhase !== 'picking') return
    
    setSelectedCard(position)
    setGamePhase('result')
    
    // Find where joker actually is now
    const jokerCurrentPos = cardPositions.indexOf(jokerPosition)
    const won = position === jokerCurrentPos
    
    // Reveal all cards
    setRevealedCards([0, 1, 2])
    
    // Vibrate on result
    if (navigator.vibrate) {
      navigator.vibrate(won ? [100, 50, 100] : [200])
    }
    
    // API call
    const res = await playGame('cards', betAmount, {
      jokerPosition: jokerCurrentPos,
      selectedPosition: position,
      won,
      multiplier: 1.5  // 1.5x multiplier for finding the joker
    })
    
    if (res?.error) {
      toast.error(res.error)
      setGamePhase('idle')
      return
    }
    
    if (res) {
      updateBalance(res.new_balance)
      setResult({
        won,
        amount: Math.abs(res.points_change)
      })
    }
  }

  const getCardAtPosition = (position) => {
    // Don't show any cards if joker position is not set (game hasn't started)
    if (jokerPosition === -1) return '?'
    
    const originalIndex = cardPositions[position]
    if (originalIndex === jokerPosition) return '🃏'
    if (originalIndex === (jokerPosition + 1) % 3) return '👸'
    return '🤴'
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">🃏 Find the Joker</h2>
      
      <div className="game-container">
        {/* Status */}
        <div className="text-center mb-6">
          {gamePhase === 'idle' && (
            <p className="text-gray-400">Find the Joker to win 1.5x!</p>
          )}
          {gamePhase === 'showing' && (
            <motion.p 
              className="text-yellow-400 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👀 Remember the Joker position!
            </motion.p>
          )}
          {gamePhase === 'shuffling' && (
            <motion.p 
              className="text-blue-400 font-bold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              🔀 Shuffling... ({shuffleCount})
            </motion.p>
          )}
          {gamePhase === 'picking' && (
            <motion.p 
              className="text-green-400 font-bold text-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👆 Pick a card!
            </motion.p>
          )}
        </div>
        
        {/* Cards */}
        <div className="flex justify-center gap-4 mb-8 relative" style={{ height: 180 }}>
          {[0, 1, 2].map((position) => {
            const isRevealed = revealedCards.includes(position)
            const isSelected = selectedCard === position
            const card = getCardAtPosition(position)
            const isJoker = card === '🃏'
            
            return (
              <motion.div
                key={`card-${position}`}
                className="absolute"
                style={{ 
                  width: 80,
                  left: `calc(50% + ${(position - 1) * 100}px - 40px)`,
                  zIndex: isSelected ? 10 : 5
                }}
                animate={{
                  left: gamePhase === 'shuffling' 
                    ? `calc(50% + ${(cardPositions.indexOf(position) - 1) * 100}px - 40px)`
                    : `calc(50% + ${(position - 1) * 100}px - 40px)`
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 20,
                  duration: 0.4
                }}
              >
                <motion.button
                  className={`w-20 h-32 rounded-xl flex items-center justify-center text-4xl relative overflow-hidden ${
                    isSelected && result?.won ? 'ring-4 ring-green-400' :
                    isSelected && !result?.won ? 'ring-4 ring-red-400' :
                    gamePhase === 'picking' ? 'cursor-pointer' : ''
                  }`}
                  style={{
                    background: isRevealed 
                      ? 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)',
                    boxShadow: isSelected ? '0 0 30px rgba(255,255,255,0.3)' : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  onClick={() => pickCard(position)}
                  disabled={gamePhase !== 'picking'}
                  whileHover={gamePhase === 'picking' ? { 
                    scale: 1.1, 
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  } : {}}
                  whileTap={gamePhase === 'picking' ? { scale: 0.95 } : {}}
                >
                  {/* Card back pattern */}
                  {!isRevealed && (
                    <div className="absolute inset-2 border-2 border-blue-400/30 rounded-lg flex items-center justify-center">
                      <motion.div
                        className="text-3xl opacity-30"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                      >
                        ✦
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Card face */}
                  {isRevealed && (
                    <motion.div
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-5xl"
                    >
                      {card}
                    </motion.div>
                  )}
                  
                  {/* Glow effect for joker */}
                  {isRevealed && isJoker && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{ 
                        boxShadow: ['0 0 20px #fbbf24', '0 0 40px #fbbf24', '0 0 20px #fbbf24']
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                  )}
                </motion.button>
                
                {/* Position indicator */}
                <div className="text-center mt-2 text-gray-500 text-sm">
                  {position + 1}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div 
              className={`text-center p-5 rounded-xl mb-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {result.won ? (
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: 2, duration: 0.3 }}
                >
                  <p className="text-3xl mb-2">🎉🃏🎉</p>
                  <p className="text-xl font-bold text-green-400">+{result.amount.toFixed(2)} pts</p>
                  <p className="text-sm text-gray-400">You found the Joker!</p>
                </motion.div>
              ) : (
                <div>
                  <p className="text-3xl mb-2">😢</p>
                  <p className="text-xl font-bold text-red-400">-{result.amount.toFixed(2)} pts</p>
                  <p className="text-sm text-gray-400">Wrong card!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Controls */}
        {(gamePhase === 'idle' || gamePhase === 'result') && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-400">Bet Amount (Max: 200)</label>
              <input 
                type="number" 
                value={betAmount}
                onChange={e => setBetAmount(Number(e.target.value))}
                min="1"
                max="200"
                className="input-field"
              />
            </div>
            
            <motion.button
              className="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
              onClick={startGame}
              disabled={balance < betAmount || betAmount <= 0 || betAmount > 200}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🃏 {balance < betAmount ? 'Insufficient Balance' : betAmount > 200 ? 'Max Bet: 200' : result ? 'Play Again' : 'Start Game'} (1.5x)
            </motion.button>

            {/* Max bet warning */}
            {betAmount > 200 && (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                <p className="text-sm text-yellow-700 font-semibold">
                  ⚠️ Maximum bet for this game is 200 points
                </p>
              </div>
            )}

            {/* Insufficient balance warning */}
            {balance < betAmount && betAmount > 0 && betAmount <= 200 && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-center">
                <p className="text-sm text-red-700 font-semibold">
                  ⚠️ You need {betAmount} points but only have {balance.toFixed(2)} points
                </p>
              </div>
            )}
          </>
        )}

        {/* Instructions */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Watch the Joker, follow the shuffle, pick the right card!
        </p>
      </div>
    </div>
  )
}
