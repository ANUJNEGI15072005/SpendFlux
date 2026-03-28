import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { MdClose } from 'react-icons/md'
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

const Transaction = () => {
  const calendarRef = useRef()
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [transaction, setTransaction] = useState([])
  const [income, setIncome] = useState(false)
  const [expense, setExpense] = useState(false)
  const [detail, setDetail] = useState(false)
  const [edit, setEdit] = useState(false)
  const [remove, setRemove] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)
  const today = new Date()
  const [range, setRange] = useState([
    {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      key: "selection"
    }
  ])

  const API_URL = import.meta.env.VITE_API_BASE_URL

  const resetForm = () => {
    setAmount("")
    setCategory("")
    setDescription("")
    setDate("")
  }

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })

  function toggleIncome() {
    if (income) {
      setIncome(false)
      resetForm()
    }
    else setIncome(true)
  }

  function toggleExpense() {
    if (expense) {
      setExpense(false)
      resetForm()
    }
    else setExpense(true)
  }

  function toggleDetail(t = null) {
    setSelectedTransaction(t)
    setDetail(prev => !prev)
  }

  function toggleEdit(t = null) {
    if (t) {
      setSelectedTransaction(t)
      setAmount(t.amount)
      setCategory(t.category)
      setDescription(t.description || "")
      setDate(t.date ? t.date.split("T")[0] : "")
    }
    setEdit(prev => !prev)
  }

  function toggleRemove(t = null) {
    setSelectedTransaction(t)
    setRemove(prev => !prev)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredTransactions = transaction
    .filter(t => {
      if (typeFilter && t.type !== typeFilter) return false
      if (categoryFilter && t.category !== categoryFilter) return false
      const tDate = new Date(t.date)
      if (
        tDate < range[0].startDate ||
        tDate > range[0].endDate
      ) return false

      return true
    })
    .sort((a, b) => {
      const d1 = new Date(a.date)
      const d2 = new Date(b.date)

      return sortOrder === "asc" ? d1 - d2 : d2 - d1
    })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/transaction`, {
          credentials: "include"
        })
        const data = await res.json()
        setTransaction(data.transaction)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  async function handleIncome(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/transaction/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ amount: Number(amount), category, description, date })
      })
      const data = await res.json()
      if (res.ok) {
        toggleIncome()
        const updated = await fetch(`${API_URL}/transaction`, {
          credentials: "include"
        })
        const updatedData = await updated.json()
        setTransaction(updatedData.transaction)
        resetForm()
      } else {
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function handleExpense(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/transaction/expense`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: Number(amount), category, description, date })
      })
      const data = await res.json()
      if (res.ok) {
        toggleExpense()
        const updated = await fetch(`${API_URL}/transaction`, {
          credentials: "include"
        })
        const updatedData = await updated.json()
        setTransaction(updatedData.transaction)
        resetForm()
      } else {
        console.error(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function handleUpdate() {
    try {
      const res = await fetch(
        `${API_URL}/transaction/${selectedTransaction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            amount: Number(amount),
            category,
            description,
            date
          })
        }
      )
      const data = await res.json()
      if (res.ok) {
        setEdit(false)
        const updated = await fetch(`${API_URL}/transaction`, {
          credentials: "include"
        })
        const updatedData = await updated.json()
        setTransaction(updatedData.transaction)
      } else {
        console.error(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(
        `${API_URL}/transaction/remove/${selectedTransaction._id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      )
      if (res.ok) {
        setRemove(false)
        const updated = await fetch(`${API_URL}/transaction`, {
          credentials: "include"
        })
        const updatedData = await updated.json()
        setTransaction(updatedData.transaction)
      } else {
        const data = await res.json()
        console.error(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Navbar />
      <div className='xl:mt-14 mt-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>

        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          <h1 className='text-xl sm:text-2xl font-heading text-center sm:text-left'>
            Transaction History
          </h1>
          <div className='flex flex-wrap justify-center sm:justify-end gap-3'>
            <button
              onClick={toggleIncome}
              className='px-4 py-1.5 text-sm sm:text-base rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition shadow-sm hover:shadow-md'
            >
              + Income
            </button>
            <button
              onClick={toggleExpense}
              className='px-4 py-1.5 text-sm sm:text-base rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm hover:shadow-md'
            >
              + Expense
            </button>
          </div>
        </div>
        <div className="mt-5 flex justify-center sm:justify-start">
          <div
            ref={calendarRef}
            className='relative bg-white border px-3 py-2 rounded-lg shadow-sm text-sm sm:text-base'
          >
            <div
              onClick={() => setShowCalendar(prev => !prev)}
              className='cursor-pointer whitespace-nowrap'
            >
              {formatDate(range[0].startDate)} → {formatDate(range[0].endDate)}
            </div>

            {showCalendar && (
              <div className='absolute left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 top-full mt-2 z-50 shadow-xl'>
                <DateRange
                  ranges={range}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-nowrap justify-between sm:justify-start gap-2 sm:gap-4">

          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className='flex-1 sm:flex-none bg-white border px-3 py-2 rounded-lg shadow-sm text-sm sm:text-base hover:shadow-md transition whitespace-nowrap'
          >
            Date {sortOrder === "asc" ? "↑" : "↓"}
          </button>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className='flex-1 sm:flex-none bg-white border px-3 py-2 rounded-lg shadow-sm text-sm sm:text-base hover:shadow-md transition'
          >
            <option value="">Both</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='flex-1 sm:flex-none bg-white border px-3 py-2 rounded-lg shadow-sm text-sm sm:text-base hover:shadow-md transition'
          >
            <option value="">All</option>
            {[...new Set(transaction.map(t => t.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-x-auto my-8">

          <table className="min-w-[700px] w-full text-blue-900 font-body text-sm sm:text-base">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Type</th>
                <th className="px-4 sm:px-6 py-3 text-left">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left">Edit</th>
                <th className="px-4 sm:px-6 py-3 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">

                      <h1 className='text-xl sm:text-2xl font-heading font-extrabold tracking-tight animate-pulse'>
                        Spend<span className='text-blue-900'>Flux</span>
                      </h1>

                      <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-blue-900 animate-[loading_1s_linear_infinite]"></div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500">
                        Loading transactions...
                      </p>

                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td
                      onClick={() => toggleDetail(t)}
                      className="px-4 sm:px-6 py-3 cursor-pointer"
                    >
                      <span className={
                        t.type === "income"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }>
                        {t.type}
                      </span>
                    </td>

                    <td
                      onClick={() => toggleDetail(t)}
                      className="px-4 sm:px-6 py-3 cursor-pointer font-medium"
                    >
                      ₹{t.amount}
                    </td>

                    <td
                      onClick={() => toggleDetail(t)}
                      className="px-4 sm:px-6 py-3 cursor-pointer text-gray-600"
                    >
                      {new Date(t.date).toLocaleDateString("en-IN")}
                    </td>

                    <td
                      onClick={() => toggleDetail(t)}
                      className="px-4 sm:px-6 py-3 cursor-pointer"
                    >
                      {t.category}
                    </td>

                    <td className="px-4 sm:px-6 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleEdit(t)
                        }}
                        className="px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      >
                        Edit
                      </button>
                    </td>

                    <td className="px-4 sm:px-6 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleRemove(t)
                        }}
                        className="px-3 py-1 text-xs sm:text-sm rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {income && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-lg z-50 p-4">
            <div className='flex justify-end'>
              <button onClick={toggleIncome} className="text-red-500"><MdClose /></button>
            </div>
            <div className='mt-1 p-2 text-center'><h1 className='text-black font-heading font-semibold sm:text-xl xs:text-lg text-base inline-flex'>Create a new <span className='text-green-600 sm:mx-2 mx-1'>income</span> transaction</h1></div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Amount</div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-green-600 text-md rounded-md'
                type="number"
                min={"1"}
                placeholder='Enter amount'
              />
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Category</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-green-600 text-md rounded-md'
              >
                <option value="">Select category</option>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="business">Business</option>
                <option value="gift">Gift</option>
              </select>
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Desciption (Optional)</div>
              <input
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-green-600 text-md rounded-md'
                type="text"
                placeholder='Enter description'
              />
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-blue-600 text-md rounded-md'
              />
            </div>
            <div className='flex justify-center mt-4 mb-2'>
              <button onClick={handleIncome} className='text-green-600 rounded-md text-md font-body px-3 py-1 border-green-600 border hover:text-white hover:bg-green-600 cursor-pointer'>Add new income</button>
            </div>
          </div>
        </div>
      )}

      {expense && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-lg z-50 p-4">
            <div className='flex justify-end'>
              <button onClick={toggleExpense} className="text-red-500"><MdClose /></button>
            </div>
            <div className='mt-1 p-2 flex text-center'><h1 className='text-black font-heading font-semibold sm:text-xl xs:text-lg text-[14px]'>Create a new <span className='text-red-600 sm:mx-2 mx-1'>expense</span> transaction</h1></div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Amount</div>
              <input
                value={amount}
                onChange={(e) => { setAmount(e.target.value) }}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-red-600 text-md rounded-md'
                type="number"
                min={"1"}
                placeholder='Enter amount'
              />
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Category</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-red-600 text-md rounded-md'
              >
                <option value="">Select category</option>
                <option value="Bills">Bills</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Groceries">Groceries</option>
                <option value="Fuel">Fuel</option>
                <option value="miscellaneous">miscellaneous</option>
              </select>
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Desciption (Optional)</div>
              <input
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-red-600 text-md rounded-md'
                type="text"
                placeholder='Enter description'
              />
            </div>
            <div className='mt-1 py-2 px-4'>
              <div className='text-md mb-1 font-body text-gray-800'>Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-red-600 text-md rounded-md'
              />
            </div>
            <div className='flex justify-center mt-4 mb-2'>
              <button onClick={handleExpense} className='text-red-600 rounded-md text-md font-body px-3 py-1 border-red-600 border hover:text-white hover:bg-red-600 cursor-pointer'>Add new expense</button>
            </div>
          </div>
        </div>
      )}

      {detail && selectedTransaction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-lg z-50 sm:p-6 p-4 sm:w-[400px] w-[350px]">
            <div className='flex justify-end'>
              <button onClick={() => toggleDetail(null)} className="text-red-500 text-lg">
                <MdClose />
              </button>
            </div>
            <div className='text-center mb-8'>
              <h1 className='text-blue-900 font-heading font-semibold text-2xl'>
                Transaction Detail
              </h1>
            </div>
            <div className="space-y-3 font-body text-gray-800">
              <div className="flex justify-between">
                <span className="font-semibold">Type:</span>
                <span className={selectedTransaction.type === "income" ? "text-green-600" : "text-red-600"}>
                  {selectedTransaction.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>₹{selectedTransaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Category:</span>
                <span>{selectedTransaction.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>
                  {new Date(selectedTransaction.date).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedTransaction.description || "No description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {edit && selectedTransaction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-lg z-50 sm:p-6 p-4 sm:w-[400px] w-[350px]">
            <div className='flex justify-end'>
              <button onClick={() => setEdit(false)} className="text-red-500 text-lg">
                <MdClose />
              </button>
            </div>
            <div className='text-center mb-8'>
              <h1 className='text-blue-900 font-heading font-semibold text-2xl'>
                Edit Transaction
              </h1>
            </div>
            <div className="space-y-3 font-body text-gray-800">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-blue-600 rounded-md'
                type="number"
              />
              <div className='space-y-1'>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg text-sm sm:text-base 
    focus:outline-none focus:border-blue-600 transition`}
                >
                  {selectedTransaction.type === "income" ? (
                    <>
                      <option value="salary">Salary</option>
                      <option value="freelance">Freelance</option>
                      <option value="business">Business</option>
                      <option value="gift">Gift</option>
                    </>
                  ) : (
                    <>
                      <option value="Bills">Bills</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Medical">Medical</option>
                      <option value="Education">Education</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Fuel">Fuel</option>
                      <option value="miscellaneous">Miscellaneous</option>
                    </>
                  )}
                </select>
              </div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-blue-600 rounded-md'
                placeholder="Description"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='w-full px-2 py-1 border-2 focus:outline-none focus:border-blue-600 rounded-md'
              />
              <button
                onClick={handleUpdate}
                className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
              >
                Update Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {remove && selectedTransaction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-lg z-50 sm:p-6 p-4 sm:w-[400px] w-[350px]">
            <div className='text-center mb-8'>
              <h1 className='text-blue-900 font-heading font-semibold text-2xl'>
                Are you sure to delete this transaction
              </h1>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDelete}
                className="text-white bg-red-500 px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setRemove(false)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Transaction
