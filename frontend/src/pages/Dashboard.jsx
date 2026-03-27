import React, { useContext, useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import { MdClose } from 'react-icons/md'
import Graphics from '../components/Graphics'
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

const Dashboard = () => {
  const calendarRef = useRef()
  const { user } = useContext(AuthContext)
  const [transaction, setTransaction] = useState([])
  const [income, setIncome] = useState(false)
  const [expense, setExpense] = useState(false)
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

  useEffect(() => {
    fetch(`${API_URL}/transaction`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setTransaction(data.transaction))
      .catch(err => console.error(err))
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

  return (
    <>
      <Navbar />
      <div className='mt-8 sm:mt-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>

        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>

          <h1 className='text-lg sm:text-xl lg:text-2xl font-heading text-center sm:text-left'>
            Welcome Back,
            <span className='text-blue-900 font-bold ml-2'>
              {user.name}
            </span>
          </h1>

          <div className='flex justify-center sm:justify-end gap-3 flex-wrap'>
            <button
              onClick={toggleIncome}
              className='px-3 py-1.5 text-sm sm:text-base rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition'
            >
              + Income
            </button>

            <button
              onClick={toggleExpense}
              className='px-3 py-1.5 text-sm sm:text-base rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition'
            >
              + Expense
            </button>
          </div>
        </div>

        <div ref={calendarRef} className='mt-4 flex justify-center sm:justify-start relative'>
          <div
            onClick={() => setShowCalendar(prev => !prev)}
            className='cursor-pointer text-sm sm:text-base border px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition'
          >
            {formatDate(range[0].startDate)} → {formatDate(range[0].endDate)}
          </div>

          {showCalendar && (
            <div className='absolute top-full mt-2 z-50 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 shadow-lg'>
              <DateRange
                ranges={range}
                onChange={(item) => setRange([item.selection])}
              />
            </div>
          )}
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
      
      <Graphics
        startDate={range[0].startDate}
        endDate={range[0].endDate}
        transaction={transaction}
      />
    </>
  )
}

export default Dashboard
