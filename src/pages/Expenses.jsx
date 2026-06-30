import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Expenses() {
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [editingId, setEditingId] = useState(null)

  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
    fetchExpenses()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch (err) {
      console.error(err)
      setError("Unable to load categories")
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses")
      setExpenses(response.data)
    } catch (err) {
      console.error(err)
      setError("Unable to load expenses")
    }
  }

  const clearForm = () => {
    setAmount("")
    setDescription("")
    setTransactionDate("")
    setCategoryId("")
    setEditingId(null)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const response = await api.post("/categories", { name: newCategoryName })
      setCategories([...categories, response.data])
      setCategoryId(response.data.id.toString())
      setNewCategoryName("")
    } catch (err) {
      console.error(err)
      setError("Failed to add category. It may already exist.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    const expenseData = {
      amount: parseFloat(amount),
      description,
      transactionDate,
      categoryId: parseInt(categoryId),
    }

    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, expenseData)
        setSuccess("Expense updated successfully.")
      } else {
        await api.post("/expenses", expenseData)
        setSuccess("Expense added successfully.")
      }

      clearForm()
      fetchExpenses()
    } catch (err) {
      console.error(err)
      const data = err.response?.data
      setError(typeof data === "string" ? data : "Operation failed. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return
    }

    try {
      await api.delete(`/expenses/${id}`)
      setSuccess("Expense deleted successfully.")
      fetchExpenses()
    } catch (err) {
      console.error(err)
      setError("Failed to delete expense.")
    }
  }

  const handleEdit = (expense) => {
    setAmount(expense.amount.toString())
    setDescription(expense.description || "")
    setTransactionDate(expense.transactionDate)

    const matchedCategory = categories.find((c) => c.name === expense.categoryName)
    if (matchedCategory) {
      setCategoryId(matchedCategory.id.toString())
    }

    setEditingId(expense.id)
  }

  const filteredExpenses = expenses.filter((e) =>
    (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

 return (
  <div className="max-w-2xl">
    <h1 className="font-display text-3xl text-ink mb-6">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-stone rounded-xl p-6 space-y-4">
          {success && (
            <div className="bg-sage/10 text-sage rounded-md px-3 py-2 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-ink mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-1">Transaction Date</label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-1">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="flex-1 border border-stone rounded-md px-3 py-2 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-amber"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="border border-stone text-ink px-4 py-2 rounded-md text-sm hover:bg-stone/30 transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-ink text-paper rounded-md py-2 font-medium hover:bg-amber transition-colors"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="w-full border border-stone text-ink rounded-md py-2 hover:bg-stone/30 transition-colors"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-ink">Your Expenses</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by description..."
              className="border border-stone rounded-md px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="text-ink/60">
              {searchQuery ? "No expenses match your search." : "No expenses found."}
            </p>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="bg-white border border-stone rounded-lg p-4 mb-4">
                <p className="text-ink">
                  <span className="font-medium">Description:</span> {expense.description || "No description"}
                </p>
                <p className="font-mono text-ink">
                  <span className="font-sans font-medium">Amount:</span> ₹{expense.amount.toFixed(2)}
                </p>
                <p className="text-ink">
                  <span className="font-medium">Category:</span> {expense.categoryName}
                </p>
                <p className="text-ink">
                  <span className="font-medium">Date:</span> {expense.transactionDate}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="border border-stone text-ink px-4 py-2 rounded-md hover:bg-stone/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="border border-red-200 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    // </div>
  )
}

export default Expenses;