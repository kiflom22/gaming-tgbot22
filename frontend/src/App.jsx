import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Auth from './pages/Auth'
import Lobby from './pages/Lobby'
import Limbo from './pages/Limbo'
import Mining from './pages/Mining'
import Slots from './pages/Slots'
import Crash from './pages/Crash'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Statistics from './pages/Statistics'
import AdminDashboard from './pages/AdminDashboard'
import { getGameStatus, getUserBalance } from './api'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [gameStatuses, setGameStatuses] = useState({})
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    const adminStatus = localStorage.getItem('is_admin')
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setBalance(parsedUser.balance || 0)
      setIsAdmin(adminStatus === 'true')
      setIsAuthenticated(true)
      
      // Fetch latest balance
      getUserBalance().then(bal => {
        if (typeof bal === 'number') {
          setBalance(bal)
        }
      }).catch(err => {
        console.log('Balance fetch failed:', err)
        // Keep using the balance from userData
      })
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    getGameStatus().then(statuses => setGameStatuses(statuses)).catch(() => {})
  }, [])

  // Auto-refresh balance every 5 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    const refreshBalance = async () => {
      const bal = await getUserBalance()
      if (typeof bal === 'number') {
        setBalance(bal)
        // Also update localStorage
        const userData = localStorage.getItem('user_data')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          const updatedUser = { ...parsedUser, balance: bal }
          setUser(updatedUser)
          localStorage.setItem('user_data', JSON.stringify(updatedUser))
        }
      }
    }

    // Refresh immediately
    refreshBalance()

    // Then refresh every 5 seconds
    const interval = setInterval(refreshBalance, 5000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleAuthSuccess = (userData, adminStatus) => {
    setUser(userData)
    setBalance(userData.balance || 0)
    setIsAdmin(adminStatus)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('is_admin')
    setUser(null)
    setBalance(0)
    setIsAdmin(false)
    setIsAuthenticated(false)
  }

  const updateBalance = (newBalance) => {
    if (typeof newBalance === 'number') {
      setBalance(newBalance)
      // Update user data in localStorage
      if (user) {
        const updatedUser = { ...user, balance: newBalance }
        setUser(updatedUser)
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
      }
    }
  }

  const refreshBalance = async () => {
    const bal = await getUserBalance()
    if (typeof bal === 'number') {
      setBalance(bal)
      // Also update localStorage
      if (user) {
        const updatedUser = { ...user, balance: bal }
        setUser(updatedUser)
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
      }
      toast.success('Balance refreshed!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transparent">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-xl text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        <Auth onAuthSuccess={handleAuthSuccess} />
      </>
    )
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="min-h-screen p-4 max-w-lg mx-auto transparent">
        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl mb-4 shadow-lg border border-cyan-500/30">
          <div>
            <div className="text-lg font-semibold text-white">🎮 Gaming Platform</div>
            <div className="text-xs text-white">@{user?.username || 'Player'}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">💰 {Number(balance).toFixed(2)}</div>
            <div className="text-xs text-white">points</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshBalance}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-all"
              title="Refresh balance"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<Lobby balance={balance} gameStatuses={gameStatuses} isAdmin={isAdmin} />} />
          <Route path="/limbo" element={<Limbo balance={balance} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/mining" element={<Mining balance={balance} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/slots" element={<Slots balance={balance} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/crash" element={<Crash balance={balance} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/cards" element={<Cards balance={balance} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/transactions" element={<Transactions balance={balance} updateBalance={updateBalance} toast={toast} />} />
          <Route path="/statistics" element={<Statistics toast={toast} />} />
          <Route path="/admin" element={<AdminDashboard isAdmin={isAdmin} toast={toast} />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}



