import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const clearForm = () => {
    setFormData({
      username: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await fetch('http://localhost:8000/api/user/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }

        // Save token and user data
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        localStorage.setItem('is_admin', data.is_admin)

        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(data.user, data.is_admin)
        }

        // Navigate to lobby
        navigate('/')
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        if (formData.username.length < 3) {
          setError('Username must be at least 3 characters')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:8000/api/user/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            phone: formData.phone,
            password: formData.password
          })
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }

        // Save token and user data
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        localStorage.setItem('is_admin', data.is_admin)

        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(data.user, data.is_admin)
        }

        // Navigate to lobby
        navigate('/')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Connection error. Please make sure the backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%)'
    }}>
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            background: `radial-gradient(circle, ${
              ['rgba(34, 211, 238, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(0, 237, 100, 0.3)'][i % 3]
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Coins */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`coin-${i}`}
          className="absolute text-4xl"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotateY: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          💰
        </motion.div>
      ))}

      <div className="max-w-md w-full relative z-10">
        {/* Title with entrance animation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-2 neon-text"
            animate={{
              textShadow: [
                '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.6)',
                '0 0 20px rgba(0, 237, 100, 0.8), 0 0 30px rgba(0, 237, 100, 0.6)',
                '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.6)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎮 Gaming Platform
          </motion.h1>
          <motion.p 
            className="text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Play games, win points, withdraw cash!
          </motion.p>
        </motion.div>

        {/* Form container with scale animation */}
        <motion.div 
          className="game-container relative"
          initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Glowing border animation */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(45deg, #22d3ee, #a855f7, #00ED64, #22d3ee)',
              backgroundSize: '300% 300%',
              filter: 'blur(20px)',
              opacity: 0.3,
              zIndex: -1,
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Toggle Login/Register with slide animation */}
          <motion.div 
            className="flex gap-2 mb-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-green-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-cyan-500/30'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-green-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-cyan-500/30'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
          </motion.div>

          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {isLogin ? (
              <>
                {/* Login Form */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Username
                  </label>
                  <motion.input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="input-field"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Password
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input-field"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </>
            ) : (
              <>
                {/* Register Form */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Username
                  </label>
                  <motion.input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username (min 3 characters)"
                    className="input-field"
                    required
                    minLength={3}
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Phone Number
                  </label>
                  <motion.input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="input-field"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Password
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    className="input-field"
                    required
                    minLength={6}
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.85 }}
                >
                  <label className="block text-sm font-bold text-white mb-2">
                    Confirm Password
                  </label>
                  <motion.input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="input-field"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div 
                  className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-3 text-sm text-cyan-300 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  ℹ️ After registration, contact admin to add points when you make a payment.
                </motion.div>
              </>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="btn btn-primary relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.span
                animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {loading ? 'Please wait...' : isLogin ? '🎮 Login' : '✨ Create Account'}
              </motion.span>
            </motion.button>

            {/* Clear Button */}
            <motion.button
              type="button"
              onClick={clearForm}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-cyan-400 py-3 rounded-xl font-bold transition-all shadow-lg border border-cyan-500/30"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95 }}
            >
              🗑️ Clear Form
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-6 text-center text-sm text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <motion.button
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                  }}
                  className="text-green-400 font-bold hover:text-green-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Register here
                </motion.button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <motion.button
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                  }}
                  className="text-green-400 font-bold hover:text-green-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Login here
                </motion.button>
              </p>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-6 text-center text-sm text-cyan-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.p
            animate={{
              textShadow: [
                '0 0 10px rgba(34, 211, 238, 0.5)',
                '0 0 20px rgba(34, 211, 238, 0.8)',
                '0 0 10px rgba(34, 211, 238, 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮 Play • 💰 Win • 💸 Withdraw
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

