import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminPanel({ toast }) {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([
    { id: 1, telegram_id: 12345, username: 'testuser', balance: 1000, status: 'active' },
    { id: 2, telegram_id: 67890, username: 'player2', balance: 500, status: 'active' },
    { id: 3, telegram_id: 11111, username: 'player3', balance: 2000, status: 'suspended' },
  ])
  
  const [withdrawals, setWithdrawals] = useState([
    { id: 1, username: 'testuser', points: 500, payment_method: 'bank', payment_details: 'Account: 123456', status: 'pending', created_at: new Date() },
    { id: 2, username: 'player2', points: 1000, payment_method: 'mobile', payment_details: '+251912345678', status: 'pending', created_at: new Date() },
    { id: 3, username: 'player3', points: 750, payment_method: 'bank', payment_details: 'Account: 789012', status: 'approved', created_at: new Date() },
  ])

  const [selectedUser, setSelectedUser] = useState(null)
  const [pointsToAdd, setPointsToAdd] = useState('')

  // Add points to user
  const handleAddPoints = (userId) => {
    const points = parseInt(pointsToAdd)
    if (!points || points <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setUsers(users.map(u => 
      u.id === userId ? { ...u, balance: u.balance + points } : u
    ))
    
    toast.success(`Added ${points} points successfully!`)
    setSelectedUser(null)
    setPointsToAdd('')
  }

  // Suspend/Activate user
  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active'
        toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'}!`)
        return { ...u, status: newStatus }
      }
      return u
    }))
  }

  // Approve withdrawal
  const handleApproveWithdrawal = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'approved' } : w
    ))
    toast.success('Withdrawal approved!')
  }

  // Reject withdrawal
  const handleRejectWithdrawal = (withdrawalId) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId)
    
    // Refund points to user
    setUsers(users.map(u =>
      u.username === withdrawal.username ? { ...u, balance: u.balance + withdrawal.points } : u
    ))
    
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'rejected' } : w
    ))
    
    toast.warning('Withdrawal rejected and points refunded')
  }

  // Mark as paid
  const handleMarkAsPaid = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'paid' } : w
    ))
    toast.success('Marked as paid!')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-600 hover:text-blue-800 block mb-4">← Back to Games</Link>
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🛡️ Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            💸 Withdrawals
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Users</h2>
            
            {users.map(user => (
              <div key={user.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-800">@{user.username}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">ID: {user.telegram_id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{user.balance} pts</div>
                    <div className="text-xs text-gray-500">Current Balance</div>
                  </div>
                </div>

                {selectedUser === user.id ? (
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Add Points (Based on External Payment)
                      </label>
                      <input
                        type="number"
                        value={pointsToAdd}
                        onChange={(e) => setPointsToAdd(e.target.value)}
                        placeholder="Enter points amount"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddPoints(user.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
                      >
                        ✅ Add Points
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(null)
                          setPointsToAdd('')
                        }}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      💰 Add Points
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        user.status === 'active'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {user.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Withdrawal Requests</h2>
            
            {withdrawals.map(withdrawal => (
              <div key={withdrawal.id} className={`bg-white rounded-xl p-6 shadow-lg border-2 ${
                withdrawal.status === 'pending' ? 'border-yellow-400' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">@{withdrawal.username}</h3>
                    <div className="text-sm text-gray-500">
                      {new Date(withdrawal.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{withdrawal.points} pts</div>
                    <div className="text-xs text-gray-500">Br {withdrawal.points}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Payment Method:</span> {withdrawal.payment_method}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Payment Details:</span> {withdrawal.payment_details}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
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
                          onClick={() => handleApproveWithdrawal(withdrawal.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleRejectWithdrawal(withdrawal.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {withdrawal.status === 'approved' && (
                      <button
                        onClick={() => handleMarkAsPaid(withdrawal.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        💵 Mark as Paid
                        </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
