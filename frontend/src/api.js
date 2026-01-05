// Hardcoded for production deployment
const API_BASE = 'https://gaming-tgbot22-1.onrender.com'

// Store auth token
let authToken = null

export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function getAuthToken() {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token')
  }
  return authToken
}

export function clearAuth() {
  authToken = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

// Authenticate using Telegram initData (secure)
export async function authenticateUser(initData) {
  try {
    console.log('Authenticating with Telegram initData...')
    const res = await fetch(`${API_BASE}/api/user/auth/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData
      }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log('Auth response:', data)
    
    if (data.error) {
      return { error: data.error }
    }
    
    if (data.token) {
      setAuthToken(data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
    }
    
    return data
  } catch (e) {
    console.error('Auth error:', e)
    return { error: 'Cannot connect to backend. Make sure Django server is running.' }
  }
}

// Verify existing token
export async function verifyToken() {
  const token = getAuthToken()
  if (!token) return { error: 'No token found' }
  
  try {
    const res = await fetch(`${API_BASE}/api/user/verify/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    
    if (data.error) {
      clearAuth()
      return { error: data.error }
    }
    
    return data
  } catch (e) {
    console.error('Token verification error:', e)
    clearAuth()
    return { error: 'Token verification failed' }
  }
}

export async function playGame(gameType, betAmount, gameData = {}) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/games/api/play/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        game_type: gameType,
        bet_amount: betAmount,
        game_data: gameData
      })
    })
    const data = await res.json()
    if (data.error) {
      return { error: data.error }
    }
    return data
  } catch (e) {
    return { error: 'Error playing game. Please try again.' }
  }
}

export async function getUserBalance() {
  const token = getAuthToken()
  if (!token) return 0
  
  try {
    const res = await fetch(`${API_BASE}/api/user/balance/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data.balance || 0
  } catch (e) {
    console.error('Balance error:', e)
    return 0
  }
}

export async function getUserStats() {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    const res = await fetch(`${API_BASE}/api/user/stats/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return await res.json()
  } catch (e) {
    console.error('Stats error:', e)
    return null
  }
}

export async function requestWithdrawal(points, paymentMethod, paymentDetails) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/user/withdrawal/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        points,
        payment_method: paymentMethod,
        payment_details: paymentDetails
      })
    })
    
    // Check if response is ok
    if (!res.ok) {
      const errorData = await res.json()
      return { error: errorData.error || 'Failed to create withdrawal' }
    }
    
    const data = await res.json()
    
    // Check if data has error
    if (data.error) {
      return { error: data.error }
    }
    
    return data
  } catch (e) {
    console.error('Withdrawal error:', e)
    return { error: 'Failed to request withdrawal. Please check your connection.' }
  }
}

export async function getWithdrawals() {
  const token = getAuthToken()
  if (!token) return []
  
  try {
    const res = await fetch(`${API_BASE}/api/user/withdrawals/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return await res.json()
  } catch (e) {
    console.error('Withdrawals error:', e)
    return []
  }
}

export async function getGameStatus() {
  try {
    const res = await fetch(`${API_BASE}/games/api/status/`)
    return await res.json()
  } catch (e) {
    console.error('Game status error:', e)
    return {}
  }
}


export async function getGameHistory() {
  const token = getAuthToken()
  if (!token) return []
  
  try {
    const res = await fetch(`${API_BASE}/games/api/history/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return await res.json()
  } catch (e) {
    console.error('History error:', e)
    return []
  }
}

// ============================================
// ADMIN API FUNCTIONS
// ============================================

export async function adminGetUsers() {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin get users error:', e)
    return { error: 'Failed to fetch users' }
  }
}

export async function adminAddPoints(userId, points, note = '') {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/add-points/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ points, note })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin add points error:', e)
    return { error: 'Failed to add points' }
  }
}

export async function adminSuspendUser(userId, suspend) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/suspend/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ suspend })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin suspend user error:', e)
    return { error: 'Failed to suspend user' }
  }
}

export async function adminDeleteUser(userId) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin delete user error:', e)
    return { error: 'Failed to delete user' }
  }
}

export async function adminGetWithdrawals() {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/withdrawals/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin get withdrawals error:', e)
    return { error: 'Failed to fetch withdrawals' }
  }
}

export async function adminApproveWithdrawal(withdrawalId) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/withdrawals/${withdrawalId}/approve/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin approve withdrawal error:', e)
    return { error: 'Failed to approve withdrawal' }
  }
}

export async function adminRejectWithdrawal(withdrawalId, reason = '') {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/withdrawals/${withdrawalId}/reject/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin reject withdrawal error:', e)
    return { error: 'Failed to reject withdrawal' }
  }
}

export async function adminMarkWithdrawalPaid(withdrawalId) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/withdrawals/${withdrawalId}/paid/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin mark paid error:', e)
    return { error: 'Failed to mark as paid' }
  }
}

export async function adminGetGameSessions() {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/game-sessions/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin get game sessions error:', e)
    return { error: 'Failed to fetch game sessions' }
  }
}

export async function adminGetGameStatuses() {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/game-statuses/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin get game statuses error:', e)
    return { error: 'Failed to fetch game statuses' }
  }
}

export async function adminToggleGame(gameType) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/game-statuses/${gameType}/toggle/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin toggle game error:', e)
    return { error: 'Failed to toggle game' }
  }
}

export async function adminUpdateGameMessage(gameType, message) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/game-statuses/${gameType}/message/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin update message error:', e)
    return { error: 'Failed to update message' }
  }
}

export async function adminClearGameHistory() {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/games/api/history/clear/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin clear history error:', e)
    return { error: 'Failed to clear game history' }
  }
}


export async function adminChangePassword(oldPassword, newPassword) {
  const token = getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_BASE}/api/admin/change-password/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        old_password: oldPassword,
        new_password: newPassword
      })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Admin change password error:', e)
    return { error: 'Failed to change password' }
  }
}
