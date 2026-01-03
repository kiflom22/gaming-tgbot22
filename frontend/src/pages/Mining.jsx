import { useState } from 'react'
import { Link } from 'react-router-dom'
import { playGame } from '../api'

export default function Mining({ balance, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [mineCount, setMineCount] = useState(8)
  const [gameActive, setGameActive] = useState(false)
  const [tiles, setTiles] = useState(Array(25).fill({ revealed: false, isMine: false }))
  const [mines, setMines] = useState([])
  const [revealed, setRevealed] = useState(0)
  const [multiplier, setMultiplier] = useState(1.0)
  const [result, setResult] = useState(null)

  const startGame = () => {
    // Check if user has sufficient balance
    if (betAmount <= 0) {
      toast.error('Please enter a valid bet amount')
      return
    }

    if (balance < betAmount) {
      toast.error('Insufficient balance! Please add points to play.')
      return
    }

    let newMines = []
    
    // DIFFICULT PATTERN ALGORITHM - Strategic mine placement
    const cryptoRandom = new Uint32Array(50)
    crypto.getRandomValues(cryptoRandom)
    
    // Choose a difficult pattern strategy
    const strategy = cryptoRandom[0] % 4
    
    if (strategy === 0) {
      // CORNER TRAP - Place mines in corners and edges to force center play
      const corners = [0, 4, 20, 24]
      const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23]
      
      // Place 2-3 corner mines
      const cornerCount = 2 + (cryptoRandom[1] % 2)
      for (let i = 0; i < cornerCount && newMines.length < mineCount; i++) {
        const pos = corners[cryptoRandom[i + 2] % corners.length]
        if (!newMines.includes(pos)) newMines.push(pos)
      }
      
      // Fill rest with edges and random
      while (newMines.length < mineCount) {
        const useEdge = cryptoRandom[newMines.length + 10] % 3 > 0
        if (useEdge) {
          const pos = edges[cryptoRandom[newMines.length + 15] % edges.length]
          if (!newMines.includes(pos)) newMines.push(pos)
        } else {
          const pos = cryptoRandom[newMines.length + 20] % 25
          if (!newMines.includes(pos)) newMines.push(pos)
        }
      }
    } else if (strategy === 1) {
      // SCATTERED WITH GAPS - No adjacent mines, creates false safety
      let attempts = 0
      while (newMines.length < mineCount && attempts < 200) {
        const pos = cryptoRandom[attempts % cryptoRandom.length] % 25
        if (!newMines.includes(pos)) {
          // Check if not adjacent to existing mines
          const row = Math.floor(pos / 5)
          const col = pos % 5
          const hasAdjacent = newMines.some(mine => {
            const mRow = Math.floor(mine / 5)
            const mCol = mine % 5
            return Math.abs(row - mRow) <= 1 && Math.abs(col - mCol) <= 1
          })
          
          if (!hasAdjacent || newMines.length >= mineCount - 2) {
            newMines.push(pos)
          }
        }
        attempts++
        if (attempts % 25 === 0) crypto.getRandomValues(cryptoRandom)
      }
    } else if (strategy === 2) {
      // CLUSTER TRAP - 2-3 mines together, rest scattered
      const clusterCenter = cryptoRandom[2] % 25
      newMines.push(clusterCenter)
      
      // Add 1-2 adjacent to cluster
      const row = Math.floor(clusterCenter / 5)
      const col = clusterCenter % 5
      const adjacent = []
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
            const pos = nr * 5 + nc
            if (pos !== clusterCenter) adjacent.push(pos)
          }
        }
      }
      
      const clusterSize = 1 + (cryptoRandom[3] % 2)
      for (let i = 0; i < clusterSize && newMines.length < mineCount; i++) {
        const pos = adjacent[cryptoRandom[i + 4] % adjacent.length]
        if (!newMines.includes(pos)) newMines.push(pos)
      }
      
      // Scatter remaining far from cluster
      while (newMines.length < mineCount) {
        const pos = cryptoRandom[newMines.length + 25] % 25
        if (!newMines.includes(pos)) {
          const distance = Math.abs(Math.floor(pos / 5) - row) + Math.abs((pos % 5) - col)
          if (distance >= 2 || newMines.length >= mineCount - 1) {
            newMines.push(pos)
          }
        }
      }
    } else {
      // DIAGONAL PATTERN - Mines along diagonals
      const diagonals = [
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
        [2, 6, 12, 18, 22],
        [1, 7, 13, 19]
      ]
      const diagonal = diagonals[cryptoRandom[3] % diagonals.length]
      
      // Place some on diagonal
      for (let i = 0; i < Math.min(4, mineCount); i++) {
        const pos = diagonal[cryptoRandom[i + 5] % diagonal.length]
        if (!newMines.includes(pos)) newMines.push(pos)
      }
      
      // Fill rest randomly
      while (newMines.length < mineCount) {
        const pos = cryptoRandom[newMines.length + 30] % 25
        if (!newMines.includes(pos)) newMines.push(pos)
      }
    }
    
    // Ensure exactly mineCount mines
    while (newMines.length < mineCount) {
      const pos = Math.floor(Math.random() * 25)
      if (!newMines.includes(pos)) newMines.push(pos)
    }
    
    newMines = newMines.slice(0, mineCount)

    setMines(newMines)
    setTiles(Array(25).fill({ revealed: false, isMine: false }))
    setGameActive(true)
    setRevealed(0)
    setMultiplier(1.0)
    setResult(null)
  }

  const revealTile = async (index) => {
    if (!gameActive || tiles[index].revealed) return

    const newTiles = [...tiles]
    const isMine = mines.includes(index)
    newTiles[index] = { revealed: true, isMine }
    setTiles(newTiles)

    if (isMine) {
      mines.forEach(m => {
        newTiles[m] = { revealed: true, isMine: true }
      })
      setTiles([...newTiles])
      setGameActive(false)

      const res = await playGame('mining', betAmount, {
        mines: mineCount,
        revealed,
        hit_mine: true
      })

      if (res?.error) {
        toast.error(res.error)
        setGameActive(false)
        return
      }

      if (res) {
        updateBalance(res.new_balance)
        setResult({ won: false, amount: betAmount })
      }
    } else {
      const newRevealed = revealed + 1
      setRevealed(newRevealed)
      const newMult = 1.0 + (newRevealed * 0.2) // Fixed 1.2x per diamond
      setMultiplier(Math.round(newMult * 100) / 100)
    }
  }

  const cashOut = async () => {
    if (!gameActive || revealed === 0) return

    setGameActive(false)

    const res = await playGame('mining', betAmount, {
      mines: mineCount,
      revealed,
      hit_mine: false,
      multiplier: multiplier  // Send the multiplier to backend
    })

    if (res?.error) {
      toast.error(res.error)
      setGameActive(false)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      setResult({ won: true, amount: res.points_change })
    }
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">⛏️ Mines</h2>
      
      <div className="game-container">
        {/* Controls */}
        <div className="flex gap-2 mb-4">
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            placeholder="Bet amount"
            disabled={gameActive}
            className="input-field"
          />
          <select 
            value={mineCount}
            onChange={e => setMineCount(Number(e.target.value))}
            disabled={gameActive}
            className="input-field"
          >
            <option value={8}>8 Mines</option>
          </select>
        </div>

        {/* Start/Cashout button */}
        {!gameActive ? (
          <>
            <button
              className="btn btn-primary"
              onClick={startGame}
              disabled={balance < betAmount || betAmount <= 0}
            >
              {balance < betAmount ? '💰 Insufficient Balance' : result ? 'Play Again' : 'Start Game'}
            </button>

            {/* Insufficient balance warning */}
            {balance < betAmount && betAmount > 0 && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-center">
                <p className="text-sm text-red-700 font-semibold">
                  ⚠️ You need {betAmount} points but only have {balance.toFixed(2)} points
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center text-4xl font-bold text-green-400 my-4 animate-glow">
              {multiplier.toFixed(2)}x
            </div>
            <button 
              className="btn btn-success" 
              onClick={cashOut} 
              disabled={revealed === 0}
            >
              💰 Cash Out
            </button>
          </>
        )}

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2 my-4">
          {tiles.map((tile, i) => (
            <div 
              key={i}
              onClick={() => revealTile(i)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all
                ${!tile.revealed ? 'bg-dark-600 hover:bg-dark-800' : ''}
                ${tile.revealed && tile.isMine ? 'bg-red-500' : ''}
                ${tile.revealed && !tile.isMine ? 'bg-green-500' : ''}
              `}
            >
              {tile.revealed ? (tile.isMine ? '💣' : '💎') : '?'}
            </div>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div className={`text-center p-5 rounded-xl ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h3 className="text-xl font-bold">{result.won ? '🎉 Cashed Out!' : '💥 Boom!'}</h3>
            <p className="text-lg">{result.won ? '+' : '-'}{result.amount.toFixed(2)} points</p>
          </div>
        )}
      </div>
    </div>
  )
}
