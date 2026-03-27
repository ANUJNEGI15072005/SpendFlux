import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaWallet, FaArrowDown, FaPiggyBank } from "react-icons/fa"

const Profile = () => {
    const [transaction, setTransaction] = useState([])
    const [loading, setLoading] = useState(true)

    const [displayIncome, setDisplayIncome] = useState(0)
    const [displaySpent, setDisplaySpent] = useState(0)
    const [displaySavings, setDisplaySavings] = useState(0)

    const { logout, user } = useContext(AuthContext)
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_BASE_URL

    async function handleLogout(e) {
        e.preventDefault()
        try {
            logout()
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } catch (error) {
            toast.error(error?.message || "Something went wrong")
            console.error(error)
        }
    }

    useEffect(() => {
        fetch(`${API_URL}/transaction`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setTransaction(data.transaction || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const totalIncome = transaction
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0)

    const totalSpent = transaction
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0)

    const totalSavings = Math.max(totalIncome - totalSpent, 0)

    const animateValue = (start, end, setter, duration = 800) => {
        let startTime = null

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            const easeOut = 1 - Math.pow(1 - progress, 3)

            const value = Math.floor(easeOut * (end - start) + start)
            setter(value)

            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }

        requestAnimationFrame(step)
    }

    useEffect(() => {
        if (!loading) {
            animateValue(0, totalIncome, setDisplayIncome)
            animateValue(0, totalSpent, setDisplaySpent)
            animateValue(0, totalSavings, setDisplaySavings)
        }
    }, [loading, totalIncome, totalSpent, totalSavings])

    let personality = "Balanced"
    if (totalSpent > totalIncome) {
        personality = "Overspender"
    } else if (totalSavings > totalIncome * 0.5) {
        personality = "Smart Saver"
    }

    const formatCurrency = (num) => num.toLocaleString("en-IN")

    return (
        <>
            <Navbar />

            <div className='my-10 sm:mt-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 flex flex-col gap-6 sm:gap-8'>

                <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 shadow-lg text-center sm:text-left'>

                    <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-xl sm:text-2xl font-bold'>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                        <h1 className='text-lg sm:text-xl font-semibold font-heading'>
                            {user?.name || "User"}
                        </h1>
                        <p className='text-xs sm:text-sm opacity-80 font-body'>
                            {user?.email || "user@email.com"}
                        </p>
                    </div>

                </div>

                {loading ? (
                    <p className="text-center text-sm sm:text-base text-gray-500">
                        Loading your data...
                    </p>
                ) : transaction.length === 0 ? (

                    <div className="text-center text-sm sm:text-base text-gray-500 bg-white p-4 sm:p-6 rounded-xl shadow">
                        No transactions yet. Start tracking to see insights
                    </div>

                ) : (

                    <>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>

                            <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-xl transition">

                                <div className="flex items-center justify-between">
                                    <h2 className='text-xs sm:text-sm text-gray-500'>Income</h2>
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-lg">
                                        <FaWallet />
                                    </div>
                                </div>

                                <p className='text-2xl sm:text-3xl font-semibold text-green-600 mt-3'>
                                    ₹{formatCurrency(displayIncome)}
                                </p>

                            </div>


                            <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-xl transition">

                                <div className="flex items-center justify-between">
                                    <h2 className='text-xs sm:text-sm text-gray-500'>Spent</h2>
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">
                                        <FaArrowDown />
                                    </div>
                                </div>

                                <p className='text-2xl sm:text-3xl font-semibold text-red-600 mt-3'>
                                    ₹{formatCurrency(displaySpent)}
                                </p>

                            </div>

                            <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-xl transition">

                                <div className="flex items-center justify-between">
                                    <h2 className='text-xs sm:text-sm text-gray-500'>Savings</h2>
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg">
                                        <FaPiggyBank />
                                    </div>
                                </div>

                                <p className='text-2xl sm:text-3xl font-semibold text-blue-600 mt-3'>
                                    ₹{formatCurrency(displaySavings)}
                                </p>

                            </div>

                        </div>


                        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition">

                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xs sm:text-sm text-gray-500">Spending Style</h2>
                                
                            </div>

                            <p className="text-lg sm:text-xl font-semibold text-gray-800">
                                {personality}
                            </p>

                        </div>
                    </>
                )}
                <div className='flex justify-center mt-4 sm:mt-6'>
                    <button
                        onClick={handleLogout}
                        className='px-5 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition'
                    >
                        Logout
                    </button>
                </div>

            </div>
        </>
    )
}

export default Profile