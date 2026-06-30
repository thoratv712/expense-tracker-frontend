import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function generateColors(count) {
  const colors = []
  const hueStart = 15
  const hueRange = 280

  for (let i = 0; i < count; i++) {
    const hue = (hueStart + (hueRange / count) * i) % 360
    const lightness = i % 2 === 0 ? 48 : 58
    colors.push(`hsl(${hue}, 38%, ${lightness}%)`)
  }
  return colors
}

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await api.get('/expenses')
        setExpenses(response.data)
      } catch (err) {
        console.error('Failed to load expenses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (loading) {
    return <p className="text-ink">Loading...</p>
  }

  if (expenses.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ink mb-4">Dashboard</h1>
        <p className="text-ink/60">
          No expenses logged yet.{' '}
          <Link to="/expenses" className="text-sage underline">
            Add your first one
          </Link>
          .
        </p>
      </div>
    )
  }

  const categoryNames = [...new Set(expenses.map((e) => e.categoryName))]

  const displayedExpenses = selectedCategory
    ? expenses.filter((e) => e.categoryName === selectedCategory)
    : expenses

  const categoryTotals = displayedExpenses.reduce((accumulator, expense) => {
    accumulator[expense.categoryName] = (accumulator[expense.categoryName] || 0) + expense.amount
    return accumulator
  }, {})

  const monthlyTotals = displayedExpenses.reduce((accumulator, expense) => {
    const month = expense.transactionDate.slice(0, 7)
    accumulator[month] = (accumulator[month] || 0) + expense.amount
    return accumulator
  }, {})

  const recentExpenses = [...displayedExpenses]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 5)

  const categoryColorMap = {}
  const baseColors = generateColors(categoryNames.length)
  categoryNames.forEach((name, index) => {
    categoryColorMap[name] = baseColors[index]
  })

  const categoryLabels = Object.keys(categoryTotals)

  const pieData = {
    labels: categoryLabels,
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: categoryLabels.map((name) => categoryColorMap[name]),
    }],
  }

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [{
      label: 'Spending by month',
      data: Object.values(monthlyTotals),
      backgroundColor: '#C98A3E',
    }],
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Dashboard</h1>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="bg-white border border-stone rounded-xl px-6 py-4">
          <p className="text-xs text-sage uppercase tracking-widest mb-1">
            Total Spent {selectedCategory ? `· ${selectedCategory}` : ''}
          </p>
          <p className="font-mono text-3xl text-ink">
            ₹{Object.values(categoryTotals).reduce((sum, val) => sum + val, 0).toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === null ? 'bg-ink text-paper' : 'border border-stone text-ink hover:bg-stone/30'
            }`}
          >
            All
          </button>
          {categoryNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === name ? 'bg-ink text-paper' : 'border border-stone text-ink hover:bg-stone/30'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-stone rounded-xl p-6">
          <Pie data={pieData} />
        </div>
        <div className="bg-white border border-stone rounded-xl p-6">
          <Bar data={barData} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-ink mb-3">Recent transactions</h2>
        <div className="bg-white border border-stone rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone text-left text-ink/60">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-stone last:border-0">
                  <td className="px-4 py-2 text-ink">{expense.transactionDate}</td>
                  <td className="px-4 py-2 text-ink">{expense.description || '—'}</td>
                  <td className="px-4 py-2 text-ink">{expense.categoryName}</td>
                  <td className="px-4 py-2 text-ink font-mono text-right">₹{expense.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;