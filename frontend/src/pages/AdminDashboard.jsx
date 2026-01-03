import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  adminGetUsers, 
  adminAddPoints, 
  adminSuspendUser,
  adminDeleteUser,
  adminGetWithdrawals, 
  adminApproveWithdrawal, 
  adminRejectWithdrawal, 
  adminMarkWithdrawalPaid,
  adminGetGameSessions,
  adminGetGameStatuses,
  adminToggleGame,
  adminUpdateGameMessage,
  adminClearGameHistory
} from '../api'

export default function AdminDashboard({ isAdmin, toast }) {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [gameSessions, setGameSessions] = useState([])
  const [gameControls, setGameControls] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    if (!isAdmin) {
      return
    }
    loadData()
  }, [activeTab, isAdmin])

  // Removed auto-refresh - use manual refresh button instead

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const result = await adminGetUsers()
        if (!result.error) {
          setUsers(result.users || [])
        }
      } else if (activeTab === 'withdrawals') {
        const result = await adminGetWithdrawals()
        if (!result.error) {
          setWithdrawals(result.withdrawals || [])
        }
      } else if (activeTab === 'games') {
        const result = await adminGetGameSessions()
        if (!result.error) {
          setGameSessions(result.sessions || [])
        }
      } else if (activeTab === 'control') {
        const result = await adminGetGameStatuses()
        if (!result.error) {
          setGameControls(result.games || [])
        }
      } else if (activeTab === 'statistics') {
        // Load both users and withdrawals for statistics
        const [usersResult, withdrawalsResult] = await Promise.all([
          adminGetUsers(),
          adminGetWithdrawals()
        ])
        if (!usersResult.error) {
          setUsers(usersResult.users || [])
        }
        if (!withdrawalsResult.error) {
          setWithdrawals(withdrawalsResult.withdrawals || [])
        }
      }
      setLastUpdate(new Date())
    } catch (e) {
      console.error('Load data error:', e)
    }
    setLoading(false)
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-white mb-6">You don't have permission to access the admin panel.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">← Back to Lobby</Link>
      </div>
    )
  }

  const tabs = [
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'deposits', name: 'Deposits', icon: '💰' },
    { id: 'withdrawals', name: 'Withdrawals', icon: '💸' },
    { id: 'games', name: 'Game History', icon: '🎮' },
    { id: 'control', name: 'Game Control', icon: '🎛️' },
    { id: 'statistics', name: 'Statistics', icon: '📊' },
  ]

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%)'
    }}>
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-white hover:text-white font-bold">← Back</Link>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-xs text-white">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 neon-text">🛡️ Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 border border-cyan-500/30'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Manual refresh info */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 rounded-xl p-3 mb-4 text-sm text-white flex items-center gap-2 backdrop-blur-sm">
        <span className="text-lg">💡</span>
        <span>Use the refresh button above to update data manually</span>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <>
          {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} toast={toast} loadData={loadData} />}
          {activeTab === 'deposits' && <DepositsTab deposits={deposits} setDeposits={setDeposits} toast={toast} />}
          {activeTab === 'withdrawals' && <WithdrawalsTab withdrawals={withdrawals} setWithdrawals={setWithdrawals} toast={toast} loadData={loadData} />}
          {activeTab === 'games' && <GamesTab gameSessions={gameSessions} />}
          {activeTab === 'control' && <GameControlTab toast={toast} gameControls={gameControls} setGameControls={setGameControls} loadData={loadData} />}
          {activeTab === 'statistics' && <StatisticsTab users={users} withdrawals={withdrawals} />}
        </>
      )}
    </div>
  )
}

function GameControlTab({ toast, gameControls, setGameControls, loadData }) {
  const [editingGame, setEditingGame] = useState(null)
  const [editMessage, setEditMessage] = useState('')

  const toggleGame = async (gameType) => {
    const result = await adminToggleGame(gameType)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    setGameControls(gameControls.map(g => 
      g.game_type === gameType ? { ...g, is_enabled: !g.is_enabled } : g
    ))
    const game = gameControls.find(g => g.game_type === gameType)
    toast.success(`${game.name} ${!game.is_enabled ? 'enabled' : 'disabled'}`)
  }

  const startEditMessage = (game) => {
    setEditingGame(game.game_type)
    setEditMessage(game.maintenance_message)
  }

  const saveMessage = async (gameType) => {
    const result = await adminUpdateGameMessage(gameType, editMessage)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    setGameControls(gameControls.map(g => 
      g.game_type === gameType ? { ...g, maintenance_message: editMessage } : g
    ))
    toast.success('Maintenance message updated')
    setEditingGame(null)
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">ℹ️</span>
          <span className="font-bold text-blue-700">Game Control Panel</span>
        </div>
        <p className="text-sm text-white">
          Enable or disable games for maintenance. Disabled games will show a maintenance message to users.
        </p>
      </div>

      {gameControls.map(game => (
        <motion.div
          key={game.game_type}
          className={`bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 ${!game.is_enabled ? 'border-yellow-400' : 'border-cyan-500/30'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{game.icon}</div>
              <div>
                <div className="font-bold text-lg text-white">{game.name}</div>
                <div className="text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    game.is_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {game.is_enabled ? '✅ ENABLED' : '🔧 DISABLED'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toggleGame(game.game_type)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                game.is_enabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {game.is_enabled ? '🔧 Disable' : '✅ Enable'}
            </button>
          </div>

          {/* Maintenance Message */}
          <div className="mt-3 pt-3 border-t border-cyan-500/30">
            <div className="text-sm text-white mb-2">Maintenance Message:</div>
            
            {editingGame === game.game_type ? (
              <div className="space-y-2">
                <textarea
                  value={editMessage}
                  onChange={e => setEditMessage(e.target.value)}
                  className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none min-h-[80px]"
                  placeholder="Enter maintenance message..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveMessage(game.game_type)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setEditingGame(null)}
                    className="bg-gray-200 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="bg-slate-900/80 rounded-lg p-3 text-sm text-white cursor-pointer hover:bg-slate-800 border border-cyan-500/30"
                onClick={() => startEditMessage(game)}
              >
                <p>{game.maintenance_message}</p>
                <div className="text-xs text-white mt-2">Click to edit</div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function UsersTab({ users, setUsers, toast, loadData }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [pointsToAdd, setPointsToAdd] = useState(0)
  const [customAmount, setCustomAmount] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])

  const quickAmounts = [50, 100, 200, 500, 1000, 2000, 5000]

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram_id.toString().includes(searchTerm)
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && !user.is_suspended) ||
      (filterStatus === 'suspended' && user.is_suspended)
    
    return matchesSearch && matchesStatus
  })

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
  }

  const hasActiveFilters = searchTerm !== '' || filterStatus !== 'all'

  const addPoints = async (userId) => {
    if (pointsToAdd <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    
    const result = await adminAddPoints(userId, pointsToAdd, 'External payment received')
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    // Refresh the user list to get updated balance from server
    await loadData()
    
    toast.success(`Added ${pointsToAdd} points (Br ${pointsToAdd}) to user`)
    setSelectedUser(null)
    setPointsToAdd(0)
    setCustomAmount(false)
  }

  const selectQuickAmount = (amount) => {
    setPointsToAdd(amount)
    setCustomAmount(false)
  }

  const banUser = async (userId) => {
    const user = users.find(u => u._id === userId)
    const suspend = !user.is_suspended
    
    const result = await adminSuspendUser(userId, suspend)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    // Refresh the user list to get updated status from server
    await loadData()
    
    toast.success(suspend ? 'User suspended' : 'User activated')
  }

  const deleteUser = async (userId) => {
    const user = users.find(u => u._id === userId)
    
    // Confirmation dialog
    if (!confirm(`⚠️ Are you sure you want to DELETE user @${user.username}?\n\nThis will permanently delete:\n- User account\n- All game history\n- All withdrawal records\n\nThis action CANNOT be undone!`)) {
      return
    }
    
    const result = await adminDeleteUser(userId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    // Refresh the user list
    await loadData()
    
    toast.success(`User @${user.username} deleted successfully`)
  }

  // Toggle select user
  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Select all filtered users
  const selectAllUsers = () => {
    const nonAdminUsers = filteredUsers.filter(u => !u.is_admin)
    const allIds = nonAdminUsers.map(u => u._id)
    setSelectedUsers(allIds)
  }

  // Deselect all
  const deselectAllUsers = () => {
    setSelectedUsers([])
  }

  // Delete selected users
  const deleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected')
      return
    }

    // Confirmation dialog
    if (!confirm(`⚠️ Are you sure you want to DELETE ${selectedUsers.length} users?\n\nThis will permanently delete:\n- ${selectedUsers.length} user accounts\n- All their game history\n- All their withdrawal records\n\nThis action CANNOT be undone!`)) {
      return
    }

    let successCount = 0
    let errorCount = 0

    // Delete each selected user
    for (const userId of selectedUsers) {
      const result = await adminDeleteUser(userId)
      if (result.error) {
        errorCount++
      } else {
        successCount++
      }
    }

    // Clear selection
    setSelectedUsers([])

    // Refresh the user list
    await loadData()

    // Show results
    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} user(s)`)
    }
    if (errorCount > 0) {
      toast.error(`Failed to delete ${errorCount} user(s)`)
    }
  }

  return (
    <div className="space-y-3">
      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-bold text-white text-lg">
                  {selectedUsers.length} user(s) selected
                </div>
                <div className="text-sm text-red-200">
                  Ready for bulk actions
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deselectAllUsers}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                ❌ Deselect All
              </button>
              <button
                onClick={deleteSelectedUsers}
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
              >
                🗑️ Delete Selected ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-500/30">
        <div className="space-y-3">
          {/* Search Bar */}
          <div>
            <label htmlFor="user-search" className="text-sm text-white mb-1 block">🔍 Search Users:</label>
            <input
              id="user-search"
              name="user-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or telegram ID..."
              className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="user-status-filter" className="text-sm text-white mb-1 block">👤 Status:</label>
            <select
              id="user-status-filter"
              name="user-status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white"
            >
              <option value="all" className="bg-slate-800 text-white">All Users</option>
              <option value="active" className="bg-slate-800 text-white">✅ Active Only</option>
              <option value="suspended" className="bg-slate-800 text-white">🚫 Suspended Only</option>
            </select>
          </div>

          {/* Selection Actions */}
          <div className="flex gap-2">
            <button
              onClick={selectAllUsers}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              ✓ Select All ({filteredUsers.filter(u => !u.is_admin).length})
            </button>
            {selectedUsers.length > 0 && (
              <button
                onClick={deselectAllUsers}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                ❌ Deselect All
              </button>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                ❌ Clear Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-white text-center pt-2 border-t border-cyan-500/30">
            Showing <span className="font-bold text-blue-600">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> users
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl shadow border border-cyan-500/30">
          <div className="text-4xl mb-2">🔍</div>
          <div className="text-white">
            {searchTerm || filterStatus !== 'all' 
              ? 'No users match your search criteria' 
              : 'No users yet'}
          </div>
        </div>
      ) : (
        filteredUsers.map(user => (
          <motion.div
            key={user._id}
            className={`bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 transition-all ${
              selectedUsers.includes(user._id) 
                ? 'border-blue-500 ring-2 ring-blue-500/50' 
                : 'border-cyan-500/30'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Checkbox */}
              {!user.is_admin && (
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleSelectUser(user._id)}
                    className="w-5 h-5 rounded border-2 border-cyan-500/30 bg-slate-800 checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                  />
                </div>
              )}
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-white flex items-center gap-2">
                      @{user.username}
                      {user.is_admin && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-white">ID: {user.telegram_id}</div>
                    {user.is_suspended && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                        SUSPENDED
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{user.balance} pts</div>
                    <div className="text-xs text-white">Br {user.balance} • {user.games_played} games</div>
                  </div>
                </div>
              </div>
            </div>

            {selectedUser === user._id ? (
              <div className="space-y-3">
                {/* Quick Amount Buttons */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Quick Add:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map(amount => (
                      <button
                        key={amount}
                        onClick={() => selectQuickAmount(amount)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                          pointsToAdd === amount && !customAmount
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-white hover:bg-gray-200 border border-purple-500/30'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                    <button
                      onClick={() => setCustomAmount(true)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        customAmount
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-white hover:bg-gray-200 border border-purple-500/30'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Custom Amount Input */}
                {customAmount && (
                  <div>
                    <label className="text-sm text-white mb-1 block">Custom Amount:</label>
                    <input
                      type="number"
                      value={pointsToAdd}
                      onChange={e => setPointsToAdd(Number(e.target.value))}
                      placeholder="Enter points"
                      className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                )}

                {/* Amount Display */}
                {pointsToAdd > 0 && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
                    <div className="text-sm text-white">Adding:</div>
                    <div className="text-2xl font-bold text-green-600">{pointsToAdd} points</div>
                    <div className="text-sm text-green-700">= Br {pointsToAdd}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addPoints(user._id)}
                    disabled={pointsToAdd <= 0}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ✅ Confirm Add
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null)
                      setPointsToAdd(0)
                      setCustomAmount(false)
                    }}
                    className="bg-gray-200 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedUser(user._id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    💰 Add Points
                  </button>
                  <button
                    onClick={() => banUser(user._id)}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      user.is_suspended
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {user.is_suspended ? '✅ Activate' : '🚫 Suspend'}
                  </button>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="w-full bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-all flex items-center justify-center gap-2"
                >
                  🗑️ Delete User
                </button>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  )
}

function DepositsTab({ deposits, setDeposits, toast }) {
  const approveDeposit = (depositId) => {
    setDeposits(deposits.map(d =>
      d.id === depositId ? { ...d, status: 'approved' } : d
    ))
    toast.success('Deposit approved! Points added to user.')
  }

  const rejectDeposit = (depositId) => {
    setDeposits(deposits.map(d =>
      d.id === depositId ? { ...d, status: 'rejected' } : d
    ))
    toast.warning('Deposit rejected')
  }

  return (
    <div className="space-y-3">
      {deposits.map(deposit => (
        <motion.div
          key={deposit.id}
          className={`bg-dark-800 rounded-xl p-4 ${
            deposit.status === 'pending' ? 'ring-2 ring-yellow-500' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold">@{deposit.user}</div>
              <div className="text-sm text-gray-400">
                {new Date(deposit.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">Br {deposit.amount}</div>
              <div className="text-sm text-green-400">{deposit.points} points</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              deposit.status === 'pending' ? 'bg-yellow-600' :
              deposit.status === 'approved' ? 'bg-green-600' :
              'bg-red-600'
            }`}>
              {deposit.status.toUpperCase()}
            </span>

            {deposit.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => approveDeposit(deposit.id)}
                  className="btn btn-success"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => rejectDeposit(deposit.id)}
                  className="btn bg-red-600"
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function WithdrawalsTab({ withdrawals, setWithdrawals, toast, loadData }) {
  const approveWithdrawal = async (withdrawalId) => {
    const result = await adminApproveWithdrawal(withdrawalId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    setWithdrawals(withdrawals.map(w =>
      w._id === withdrawalId ? { ...w, status: 'approved' } : w
    ))
    toast.success('Withdrawal approved! Process payment externally.')
  }

  const markAsPaid = async (withdrawalId) => {
    const result = await adminMarkWithdrawalPaid(withdrawalId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    setWithdrawals(withdrawals.map(w =>
      w._id === withdrawalId ? { ...w, status: 'paid' } : w
    ))
    toast.success('Marked as paid')
  }

  const rejectWithdrawal = async (withdrawalId) => {
    const result = await adminRejectWithdrawal(withdrawalId, 'Rejected by admin')
    if (result.error) {
      toast.error(result.error)
      return
    }
    
    setWithdrawals(withdrawals.map(w =>
      w._id === withdrawalId ? { ...w, status: 'rejected' } : w
    ))
    toast.warning('Withdrawal rejected. Points refunded.')
  }

  return (
    <div className="space-y-3">
      {withdrawals.map(withdrawal => (
        <motion.div
          key={withdrawal._id}
          className={`bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 ${
            withdrawal.status === 'pending' ? 'border-yellow-400' : 'border-cyan-500/30'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-white">@{withdrawal.username || 'Unknown'}</div>
              <div className="text-sm text-white">
                {new Date(withdrawal.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-red-600">{withdrawal.points} pts</div>
              <div className="text-sm text-white">Br {withdrawal.amount || withdrawal.points}</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-lg p-3 mb-3 border border-cyan-500/30">
            <div className="text-sm text-white mb-1">
              <span className="font-semibold">Method:</span> {withdrawal.payment_method}
            </div>
            <div className="text-sm text-white">
              <span className="font-semibold">Details:</span> {withdrawal.payment_details}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              withdrawal.status === 'approved' ? 'bg-blue-100 text-blue-700' :
              withdrawal.status === 'paid' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {withdrawal.status.toUpperCase()}
            </span>

            <div className="flex gap-2">
              {withdrawal.status === 'pending' && (
                <>
                  <button
                    onClick={() => approveWithdrawal(withdrawal._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => rejectWithdrawal(withdrawal._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                  >
                    ❌ Reject
                  </button>
                </>
              )}
              {withdrawal.status === 'approved' && (
                <button
                  onClick={() => markAsPaid(withdrawal._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  💵 Mark as Paid
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function GamesTab({ gameSessions }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGame, setFilterGame] = useState('all')
  const [filterResult, setFilterResult] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [forceUpdate, setForceUpdate] = useState(0)

  const clearAllHistory = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL game history? This action cannot be undone!')) {
      return
    }
    
    const result = await adminClearGameHistory()
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      alert('✅ ' + result.message)
      window.location.reload() // Reload to refresh data
    }
  }

  // Filter game sessions based on search and filters
  const filteredSessions = gameSessions.filter(session => {
    const username = session.user_id?.username || 'Unknown'
    const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.telegram_id?.toString().includes(searchTerm)
    
    const matchesGame = filterGame === 'all' || session.game_type === filterGame
    const matchesResult = filterResult === 'all' || session.result === filterResult
    
    // Date filtering
    let matchesDate = true
    if (filterDate !== 'all') {
      const sessionDate = new Date(session.created_at)
      const now = new Date()
      
      if (filterDate === 'today') {
        matchesDate = sessionDate.toDateString() === now.toDateString()
      } else if (filterDate === 'yesterday') {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        matchesDate = sessionDate.toDateString() === yesterday.toDateString()
      } else if (filterDate === 'last7days') {
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        matchesDate = sessionDate >= sevenDaysAgo
      } else if (filterDate === 'last30days') {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        matchesDate = sessionDate >= thirtyDaysAgo
      } else if (filterDate === 'custom') {
        if (customStartDate) {
          const startDate = new Date(customStartDate)
          startDate.setHours(0, 0, 0, 0)
          matchesDate = matchesDate && sessionDate >= startDate
        }
        if (customEndDate) {
          const endDate = new Date(customEndDate)
          endDate.setHours(23, 59, 59, 999)
          matchesDate = matchesDate && sessionDate <= endDate
        }
      }
    }
    
    return matchesSearch && matchesGame && matchesResult && matchesDate
  })

  // Clear all filters - force unmount and remount
  const clearFilters = () => {
    console.log('🗑️ DELETING ALL FILTERS')
    
    // Update all states to default
    setSearchTerm('')
    setFilterGame('all')
    setFilterResult('all')
    setFilterDate('all')
    setCustomStartDate('')
    setCustomEndDate('')
    
    // Force complete re-render by changing key
    setForceUpdate(prev => prev + 1)
    
    console.log('✅ FILTERS DELETED')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || filterGame !== 'all' || filterResult !== 'all' || filterDate !== 'all'

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4" key={`filters-${forceUpdate}`}>
      {/* Search and Filter Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-500/30">
        <div className="space-y-3">
          {/* Search Bar */}
          <div>
            <label htmlFor="game-search" className="text-sm text-white mb-1 block">🔍 Search by Username or ID:</label>
            <input
              id="game-search"
              name="game-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search username or telegram ID..."
              className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Game Type Filter */}
            <div>
              <label htmlFor="filter-game-type" className="text-sm text-white mb-1 block">🎮 Game Type:</label>
              <select
                id="filter-game-type"
                name="filter-game-type"
                value={filterGame}
                onChange={(e) => setFilterGame(e.target.value)}
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white"
              >
                <option value="all" className="bg-slate-800 text-white">All Games</option>
                <option value="crash" className="bg-slate-800 text-white">🐦 Crash</option>
                <option value="limbo" className="bg-slate-800 text-white">📊 Limbo</option>
                <option value="slots" className="bg-slate-800 text-white">🎰 Slots</option>
                <option value="cards" className="bg-slate-800 text-white">🃏 Cards</option>
                <option value="mining" className="bg-slate-800 text-white">⛏️ Mining</option>
              </select>
            </div>

            {/* Result Filter */}
            <div>
              <label htmlFor="filter-result" className="text-sm text-white mb-1 block">📊 Result:</label>
              <select
                id="filter-result"
                name="filter-result"
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white"
              >
                <option value="all" className="bg-slate-800 text-white">All Results</option>
                <option value="win" className="bg-slate-800 text-white">✅ Wins Only</option>
                <option value="loss" className="bg-slate-800 text-white">❌ Losses Only</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="filter-date-range" className="text-sm text-white mb-1 block">📅 Date Range:</label>
              <select
                id="filter-date-range"
                name="filter-date-range"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white"
              >
                <option value="all" className="bg-slate-800 text-white">All Time</option>
                <option value="today" className="bg-slate-800 text-white">Today</option>
                <option value="yesterday" className="bg-slate-800 text-white">Yesterday</option>
                <option value="last7days" className="bg-slate-800 text-white">Last 7 Days</option>
                <option value="last30days" className="bg-slate-800 text-white">Last 30 Days</option>
                <option value="custom" className="bg-slate-800 text-white">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {filterDate === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800 p-3 rounded-lg border border-purple-500/30">
              <div>
                <label htmlFor="custom-start-date" className="text-sm text-white mb-1 block">From Date:</label>
                <input
                  key={`start-${forceUpdate}`}
                  id="custom-start-date"
                  name="custom-start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="custom-end-date" className="text-sm text-white mb-1 block">To Date:</label>
                <input
                  key={`end-${forceUpdate}`}
                  id="custom-end-date"
                  name="custom-end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                ❌ Delete All Filters
              </button>
            </div>
          )}

          {/* Clear All History Button */}
          <div className="flex justify-center pt-3 border-t border-red-500/30">
            <button
              type="button"
              onClick={clearAllHistory}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              🗑️ Clear All Game History
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-white text-center pt-2 border-t border-cyan-500/30">
            Showing <span className="font-bold text-blue-600">{filteredSessions.length}</span> of <span className="font-bold">{gameSessions.length}</span> sessions
          </div>
        </div>
      </div>

      {/* Game Sessions List */}
      <div className="space-y-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl shadow border border-cyan-500/30">
            <div className="text-4xl mb-2">🔍</div>
            <div className="text-white">
              {searchTerm || filterGame !== 'all' || filterResult !== 'all' 
                ? 'No sessions match your search criteria' 
                : 'No game sessions yet'}
            </div>
          </div>
        ) : (
          filteredSessions.map(session => (
            <motion.div
              key={session._id}
              className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-lg p-4 shadow border border-cyan-500/30 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between">
                {/* Left Side - User & Game Info */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {session.game_type === 'crash' && '🐦'}
                    {session.game_type === 'limbo' && '📊'}
                    {session.game_type === 'slots' && '🎰'}
                    {session.game_type === 'cards' && '🃏'}
                    {session.game_type === 'mining' && '⛏️'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      @{session.user_id?.username || 'Unknown'}
                    </div>
                    <div className="text-xs text-white capitalize">
                      {session.game_type}
                      {session.multiplier && (
                        <span className="ml-2 text-blue-600 font-bold">
                          {session.multiplier}x
                        </span>
                      )}
                    </div>
                    {/* Date Display */}
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span>🕐</span>
                      <span title={formatDateTime(session.created_at)}>
                        {formatDate(session.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Bet & Result */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${session.result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                    {session.result === 'win' ? '✅ +' : '❌ '}{Math.abs(session.points_change)}
                  </div>
                  <div className="text-xs text-white">
                    Bet: {session.bet_amount} pts
                  </div>
                  {/* Result Badge */}
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      session.result === 'win' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {session.result.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}


function StatisticsTab({ users, withdrawals }) {
  const [filterDay, setFilterDay] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')

  // Filter data by date inputs
  const filterByDate = (dateString) => {
    if (!filterDay && !filterMonth && !filterYear) {
      return true // No filters, show all
    }

    const itemDate = new Date(dateString)
    const itemDay = itemDate.getDate()
    const itemMonth = itemDate.getMonth() + 1 // 0-indexed, so add 1
    const itemYear = itemDate.getFullYear()

    let matches = true
    
    if (filterDay) {
      matches = matches && itemDay === parseInt(filterDay)
    }
    if (filterMonth) {
      matches = matches && itemMonth === parseInt(filterMonth)
    }
    if (filterYear) {
      matches = matches && itemYear === parseInt(filterYear)
    }
    
    return matches
  }

  // Calculate total points added (from user creation dates as proxy)
  // Note: In a real system, you'd track this separately
  const totalPointsAdded = users
    .filter(user => filterByDate(user.created_at))
    .reduce((sum, user) => sum + parseFloat(user.balance || 0), 0)

  // Calculate paid withdrawals
  const paidWithdrawals = withdrawals
    .filter(w => w.status === 'paid' && filterByDate(w.updated_at || w.created_at))

  const totalPaidAmount = paidWithdrawals
    .reduce((sum, w) => sum + parseFloat(w.points || 0), 0)

  // Group by date
  const groupByDate = (items, dateKey) => {
    const grouped = {}
    items.forEach(item => {
      const date = new Date(item[dateKey]).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })
    return grouped
  }

  const withdrawalsByDate = groupByDate(paidWithdrawals, 'updated_at')

  // Clear all filters
  const clearFilters = () => {
    setFilterDay('')
    setFilterMonth('')
    setFilterYear('')
  }

  const hasActiveFilters = filterDay || filterMonth || filterYear

  return (
    <div className="space-y-4">
      {/* Date Filter */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-500/30">
        <div className="space-y-3">
          <div className="text-sm text-white mb-2">📅 Filter by Date:</div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Day Input */}
            <div>
              <label htmlFor="stats-day" className="text-xs text-white mb-1 block">Day (1-31)</label>
              <input
                id="stats-day"
                type="number"
                min="1"
                max="31"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                placeholder="DD"
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold bg-slate-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Month Input */}
            <div>
              <label htmlFor="stats-month" className="text-xs text-white mb-1 block">Month (1-12)</label>
              <input
                id="stats-month"
                type="number"
                min="1"
                max="12"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                placeholder="MM"
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold bg-slate-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Year Input */}
            <div>
              <label htmlFor="stats-year" className="text-xs text-white mb-1 block">Year</label>
              <input
                id="stats-year"
                type="number"
                min="2020"
                max="2030"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                placeholder="YYYY"
                className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold bg-slate-800 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                ❌ Clear Filters
              </button>
            </div>
          )}

          {/* Active Filter Display */}
          {hasActiveFilters && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="text-sm text-white">Filtering by:</div>
              <div className="text-lg font-bold text-blue-700">
                {filterDay && <span>Day {filterDay}</span>}
                {filterDay && (filterMonth || filterYear) && <span> • </span>}
                {filterMonth && <span>Month {filterMonth}</span>}
                {(filterDay || filterMonth) && filterYear && <span> • </span>}
                {filterYear && <span>Year {filterYear}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Points Added */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">💰</div>
            <div className="text-sm opacity-80">Points Added</div>
          </div>
          <div className="text-4xl font-bold mb-1">{totalPointsAdded.toFixed(2)}</div>
          <div className="text-sm opacity-90">Br {totalPointsAdded.toFixed(2)}</div>
        </div>

        {/* Total Paid Withdrawals */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">💸</div>
            <div className="text-sm opacity-80">Paid Withdrawals</div>
          </div>
          <div className="text-4xl font-bold mb-1">{totalPaidAmount.toFixed(2)}</div>
          <div className="text-sm opacity-90">Br {totalPaidAmount.toFixed(2)} • {paidWithdrawals.length} payments</div>
        </div>
      </div>

      {/* Net Balance */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl">📊</div>
          <div className="text-sm opacity-80">Net Balance</div>
        </div>
        <div className="text-4xl font-bold mb-1">{(totalPointsAdded - totalPaidAmount).toFixed(2)}</div>
        <div className="text-sm opacity-90">
          {totalPointsAdded > totalPaidAmount ? '✅ Positive' : '⚠️ Negative'} • 
          Br {Math.abs(totalPointsAdded - totalPaidAmount).toFixed(2)}
        </div>
      </div>

      {/* Paid Withdrawals by Date */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-500/30">
        <h3 className="text-lg font-bold text-white mb-4">💸 Paid Withdrawals by Date</h3>
        
        {Object.keys(withdrawalsByDate).length === 0 ? (
          <div className="text-center py-10 text-white">
            <div className="text-4xl mb-2">📭</div>
            <div>No paid withdrawals in selected period</div>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(withdrawalsByDate)
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, items]) => {
                const dateTotal = items.reduce((sum, w) => sum + parseFloat(w.points || 0), 0)
                return (
                  <div key={date} className="border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-white">📅 {date}</div>
                      <div className="text-lg font-bold text-red-600">{dateTotal.toFixed(2)} pts</div>
                    </div>
                    <div className="space-y-2">
                      {items.map(withdrawal => (
                        <div key={withdrawal._id} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg">
                          <div>
                            <div className="font-semibold text-white">@{withdrawal.username || 'Unknown'}</div>
                            <div className="text-xs text-white">{withdrawal.payment_method}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">{withdrawal.points} pts</div>
                            <div className="text-xs text-white">Br {withdrawal.amount || withdrawal.points}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Admin Password Change */}
      <PasswordChangeSection />
    </div>
  )
}


// Password Change Component
function PasswordChangeSection() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { adminChangePassword } = await import('../api')
      const result = await adminChangePassword(oldPassword, newPassword)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        // Clear form
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cyan-500/30">
      <h3 className="text-lg font-bold text-white mb-4">🔐 Change Admin Password</h3>
      
      <form onSubmit={handleChangePassword} className="space-y-4">
        {/* Old Password */}
        <div>
          <label htmlFor="old-password" className="block text-sm text-white mb-2">
            Current Password
          </label>
          <input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="block text-sm text-white mb-2">
            New Password (min 6 characters)
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm text-white mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-3 border-2 border-purple-500/30 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-800 text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500 text-green-400' 
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Changing Password...' : '🔐 Change Password'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="text-xs text-yellow-400">
          ⚠️ Security Tips:
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Use a strong password with letters, numbers, and symbols</li>
            <li>Don't share your password with anyone</li>
            <li>Change your password regularly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



