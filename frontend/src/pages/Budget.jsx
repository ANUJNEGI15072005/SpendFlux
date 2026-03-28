import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { FaWallet, FaArrowDown, FaPiggyBank } from "react-icons/fa"

const Budget = () => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateAmount, setUpdateAmount] = useState("")
  const [budgetInput, setBudgetInput] = useState(null)
  const [amount, setAmount] = useState("")
  const [budgetLoading, setBudgetLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState([])
  const [insightLoading, setInsightLoading] = useState(false)
  const [insights, setInsights] = useState(null)

  const [displayBudget, setDisplayBudget] = useState(0)
  const [displaySpent, setDisplaySpent] = useState(0)
  const [displayRemaining, setDisplayRemaining] = useState(0)

  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const API_URL = import.meta.env.VITE_API_BASE_URL

  const normalizeBudget = (budget) => {
    if (Array.isArray(budget)) return budget[0] || null
    return budget || null
  }

  const fetchBudget = async () => {
    try {
      setBudgetLoading(true)

      const res = await fetch(`${API_URL}/budget`, {
        credentials: "include"
      })
      const data = await res.json()

      setBudgetInput(normalizeBudget(data.budget))

    } catch (err) {
      console.error(err)
    } finally {
      setBudgetLoading(false)
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  async function handleBudget(e) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    try {
      setLoading(true)

      await fetch(`${API_URL}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: Number(amount) })
      })

      await fetchBudget()
      setAmount("")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/transaction`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setTransaction(data.transaction))
      .catch(err => console.error(err))
  }, [])

  const monthlyExpenses = transaction.filter((t) => {
    const d = new Date(t.date)
    return (
      t.type === "expense" &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    )
  })

  const categoryMap = {}
  monthlyExpenses.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0
    }
    categoryMap[t.category] += t.amount
  })

  const sortedCategories = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const topCategories = sortedCategories.slice(0, 5)

  const totalSpent = monthlyExpenses.reduce((acc, t) => acc + t.amount, 0)
  const remaining = Math.max((budgetInput?.amount || 0) - totalSpent, 0)

  const percent = budgetInput?.amount
    ? (totalSpent / budgetInput.amount) * 100
    : 0

  const safePercent = Math.min(percent, 100)

  let barColor = "bg-green-500"
  if (percent >= 70 && percent < 100) barColor = "bg-yellow-400"
  else if (percent >= 100) barColor = "bg-red-500"

  const animateValue = (start, end, setter, duration = 800) => {
    let startTime = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const value = Math.floor(easeOut * (end - start) + start)

      setter(value)

      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  useEffect(() => {
    if (budgetInput?.amount) {
      animateValue(0, budgetInput.amount, setDisplayBudget)
      animateValue(0, totalSpent, setDisplaySpent)
      animateValue(0, remaining, setDisplayRemaining)
    }
  }, [budgetInput, totalSpent, remaining])

  const fetchInsights = async () => {
    try {
      setInsightLoading(true)

      const res = await fetch(`${API_URL}/budget/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          budget: budgetInput.amount,
          totalSpent,
          categories: topCategories,
        }),
      })

      const data = await res.json()

      try {
        const parsed = JSON.parse(data.insights)
        setInsights(parsed)
      } catch {
        setInsights(null)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setInsightLoading(false)
    }
  }

  async function handleUpdateBudget() {
    if (!updateAmount || Number(updateAmount) <= 0) return

    try {
      setLoading(true)

      await fetch(`${API_URL}/budget/${budgetInput._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ amount: Number(updateAmount) })
      })

      await fetchBudget()

      setInsights(null)

      setShowUpdate(false)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className='mt-10 sm:mt-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>

        {budgetLoading ? (
          /* LOADER */
          <div className="mt-20 flex justify-center">
            <div className="flex flex-col items-center gap-3">

              <h1 className='text-2xl sm:text-3xl font-heading font-extrabold tracking-tight animate-pulse'>
                Spend<span className='text-blue-900'>Flux</span>
              </h1>

              <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-900 animate-[loading_1s_linear_infinite]"></div>
              </div>

              <p className="text-sm text-gray-500">Loading your budget...</p>

            </div>
          </div>

        ) : budgetInput?.amount ? (
          <div className='w-full'>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>

              <h1 className='text-2xl sm:text-3xl lg:text-4xl text-center sm:text-left font-heading font-bold'>
                Your <span className='text-blue-900 mx-2'>{month}</span> budget
              </h1>

              <button
                onClick={() => {
                  setShowUpdate(true)
                  setUpdateAmount(budgetInput?.amount || "")
                }}
                className='px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm hover:shadow-md text-sm sm:text-base'
              >
                Update Budget
              </button>

            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>

              <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-white shadow-md hover:shadow-xl transition">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500">Budget</h2>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <FaWallet />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold mt-3 text-orange-600">
                  ₹{displayBudget.toLocaleString("en-IN")}
                </h1>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-xl transition">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500">Spent</h2>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FaArrowDown />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold mt-3 text-red-600">
                  ₹{displaySpent.toLocaleString("en-IN")}
                </h1>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-xl transition">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500">Remaining</h2>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <FaPiggyBank />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold mt-3 text-green-600">
                  ₹{displayRemaining.toLocaleString("en-IN")}
                </h1>
              </div>

            </div>

            <div className="mt-8 sm:mt-10 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-semibold">Budget Usage</h2>
                <span className="text-base sm:text-lg font-semibold">
                  {percent.toFixed(0)}%
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                ₹{totalSpent} spent out of ₹{budgetInput.amount}
              </p>

              <div className="w-full h-5 sm:h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-700`}
                  style={{ width: `${safePercent}%` }}
                />
              </div>

              <p className={`mt-3 text-xs sm:text-sm ${percent < 70 ? "text-green-600"
                : percent < 100 ? "text-yellow-500"
                  : "text-red-600"
                }`}>
                {percent < 70 && "You're doing great"}
                {percent >= 70 && percent < 100 && "You're close to your limit"}
                {percent >= 100 && "You've exceeded your budget"}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">
                Top Spending Categories
              </h2>

              {topCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">No expenses this month</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {topCategories.map((item, index) => {
                    const percent = totalSpent
                      ? (item.amount / totalSpent) * 100
                      : 0

                    return (
                      <div key={index}>
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span>{item.category}</span>
                          <span>₹{item.amount}</span>
                        </div>

                        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="my-8 sm:my-10 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">
                AI Insights
              </h2>

              {!insights && (
                <button
                  onClick={fetchInsights}
                  disabled={!totalSpent || insightLoading}
                  className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {insightLoading ? "Generating..." : "Generate Insights"}
                </button>
              )}

              {!insights ? (
                <p className="text-gray-500 text-sm">
                  Click "Generate Insights" to analyze your spending
                </p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-700 mb-2">Insight</h3>
                    <p className="text-sm">{insights.insight}</p>
                  </div>

                  <div className={`p-4 rounded-xl ${insights.risk === "low" ? "bg-green-50"
                    : insights.risk === "medium" ? "bg-yellow-50"
                      : "bg-red-50"
                    }`}>
                    <h3 className="font-semibold mb-2">Risk</h3>
                    <p className="text-sm capitalize">{insights.risk}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <h3 className="font-semibold text-purple-700 mb-2">Suggestion</h3>
                    <p className="text-sm">{insights.suggestion}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        ) : (
          <div className='mt-16 flex justify-center px-2'>
            <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8'>
              <h1 className='text-xl sm:text-2xl text-center font-bold mb-2'>
                Take Control of Your Spending
              </h1>

              <p className='text-sm text-gray-500 text-center mb-6'>
                Set your monthly budget and track where your money goes
              </p>

              <form onSubmit={handleBudget} className='flex flex-col gap-5'>
                <input
                  className='px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                  placeholder='Enter budget (₹)'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
                >
                  {loading ? "Saving..." : "Set Budget"}
                </button>
              </form>
            </div>
          </div>
        )}
        {showUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-900">
                  Update Budget
                </h2>
                <button
                  onClick={() => setShowUpdate(false)}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>

              <input
                type="number"
                value={updateAmount}
                onChange={(e) => setUpdateAmount(e.target.value)}
                placeholder="Enter new budget"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
              />

              <button
                onClick={handleUpdateBudget}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Budget
              </button>

            </div>
          </div>
        )}

      </div>

    </>
  )
}

export default Budget