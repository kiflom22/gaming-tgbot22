import { useNavigate } from 'react-router-dom'

const games = [
  { path: '/cards', icon: '🃏', name: 'Find Joker', desc: 'Track the Joker through the shuffle!', gameType: 'cards' },
  { path: '/crash', icon: '🚀', name: 'Crash', desc: 'Cash out before it crashes!', gameType: 'crash' },
  { path: '/mining', icon: '⛏️', name: 'Mines', desc: 'Reveal gems, avoid mines. Risk vs reward!', gameType: 'mining' },
  { path: '/limbo', icon: '📊', name: 'Limbo', desc: 'Set target, watch bar rise. Beat it to win!', gameType: 'limbo' },
  { path: '/slots', icon: '🎰', name: 'Slots', desc: 'Spin to win! Up to 10x jackpot!', gameType: 'slots' },
]

const menuItems = [
  { path: '/transactions', icon: '💸', name: 'Withdraw', desc: 'Request withdrawal (min 500 pts)', adminOnly: false, requiresBalance: 500 },
  { path: '/statistics', icon: '📊', name: 'Statistics', desc: 'View your game stats and history', adminOnly: false, requiresBalance: 0 },
  { path: '/admin', icon: '🛡️', name: 'Admin Panel', desc: 'Manage users, deposits & withdrawals', adminOnly: true, requiresBalance: 0 },
]

export default function Lobby({ balance = 0, gameStatuses, isAdmin }) {
  const navigate = useNavigate()
  
  // Ensure balance is a number
  const userBalance = typeof balance === 'number' ? balance : parseFloat(balance) || 0

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Choose a Game</h2>
      
      {games.map(game => (
        <div 
          key={game.path} 
          className="game-card"
          onClick={() => navigate(game.path)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-white">
                {game.icon} {game.name}
              </h3>
              <p className="text-gray-300 text-sm">
                {game.desc}
              </p>
            </div>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-4 mt-6 text-white">Account</h2>
      
      {menuItems.filter(item => !item.adminOnly || isAdmin).map(item => {
        const isLocked = userBalance < item.requiresBalance
        
        return (
          <div 
            key={item.path} 
            className={`game-card relative ${isLocked ? 'opacity-60' : ''}`}
            onClick={() => !isLocked && navigate(item.path)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {item.icon} {item.name}
                  {isLocked && <span className="ml-2 text-sm">🔒</span>}
                </h3>
                <p className="text-gray-300 text-sm">
                  {isLocked 
                    ? `Requires ${item.requiresBalance} points (You have ${Math.floor(userBalance)})` 
                    : item.desc
                  }
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
