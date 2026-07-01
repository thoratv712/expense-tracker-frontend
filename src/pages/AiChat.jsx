import { useState } from "react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import api from "../services/api"

function AiChat() {
  const [messages, setMessages] = useState([])
  const [questionInput, setQuestionInput] = useState("")
  const [rangePreset, setRangePreset] = useState("month")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function getDateRange() {
    const today = new Date()
    const end = today.toISOString().slice(0, 10)
    let start

    if (rangePreset === "month") {
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      start = firstOfMonth.toISOString().slice(0, 10)
    } else if (rangePreset === "3months") {
      const threeMonthsAgo = new Date(today)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      start = threeMonthsAgo.toISOString().slice(0, 10)
     } else if (rangePreset === "6months") {
      const sixMonthsAgo = new Date(today)
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      start = sixMonthsAgo.toISOString().slice(0, 10)
    }else if (rangePreset === "9months") {
      const nineMonthsAgo = new Date(today)
      nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9)
      start = nineMonthsAgo.toISOString().slice(0, 10)
    }else if (rangePreset === "year") {
      const firstOfYear = new Date(today.getFullYear(), 0, 1)
      start = firstOfYear.toISOString().slice(0, 10)
    }

    return { start, end }
  }

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!questionInput.trim()) return

    setLoading(true)
    setError("")

    const { start, end } = getDateRange()

    try {
      const response = await api.post("/ai/ask", {
        question: questionInput,
        startDate: start,
        endDate: end,
      })

      setMessages([
        ...messages,
        { question: questionInput, answer: response.data.answer },
      ])
      setQuestionInput("")
    } catch (err) {
      console.error(err)
      setError("Failed to get AI response.")
    } finally {
      setLoading(false)
    }
  }

 const rangeLabels = {
  month: "This month",
  "3months": "Last 3 months",
  "6months": "Last 6 months",
  "9months": "Last 9 months",
  year: "This year",
}

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink mb-6">AI Financial Assistant</h1>

      <div className="mb-6">
        <label className="block text-sm text-ink mb-2">Time period</label>
        <div className="flex gap-2">
          {Object.entries(rangeLabels).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRangePreset(value)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                rangePreset === value
                  ? "bg-ink text-paper"
                  : "border border-stone text-ink hover:bg-stone/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {messages.length === 0 ? (
          <p className="text-ink/60">Ask me anything about your expenses.</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="bg-white border border-stone rounded-lg p-4">
              <p className="font-medium text-ink">Question:</p>
              <p className="mb-3 text-ink">{message.question}</p>
              <p className="font-medium text-ink">Answer:</p>
              <div className="text-ink/80 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_strong]:text-ink [&_strong]:font-semibold">
                <ReactMarkdown>{message.answer}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
      {loading && (
        <div className="bg-white border border-stone rounded-lg p-4 mb-4 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber animate-pulse flex-shrink-0"></div>
          <p className="text-ink/60 text-sm">
            Analysing your spending data — this may take a moment...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 rounded-md px-3 py-2 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAsk} className="bg-white border border-stone rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-ink mb-2">Ask a question</label>
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Example: How can I reduce my food expenses?"
            className="w-full border border-stone rounded-md px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>


        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md py-2 font-medium text-paper transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-ink hover:bg-amber"
          }`}
        >
          {loading ? "Analysing your expenses..." : "Ask AI"}
        </button>
      </form>
    </div>
  )
}

export default AiChat;