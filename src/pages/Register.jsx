import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Register() {
    const[name,setName] = useState('')
   const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/register', { name, email, password })
      login(response.data.token, response.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold tracking-widest text-sage uppercase mb-2 text-center">
          Expense Tracker
        </p>
        <h1 className="font-display text-3xl text-ink text-center mb-8">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-stone rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2">
              {error}
            </div>
          )}
            <div>
            <label className="block text-sm text-ink mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper rounded-md py-2 font-medium hover:bg-amber transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing ...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-ink text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-sage font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register;