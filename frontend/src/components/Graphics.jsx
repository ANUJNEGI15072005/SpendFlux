import {
    BarChart, Bar, XAxis, PieChart, Pie, Cell, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts"
import { useEffect, useState } from "react"
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa"

const Graphics = ({ startDate, endDate, transaction }) => {

    const [displayIncome, setDisplayIncome] = useState(0)
    const [displayExpense, setDisplayExpense] = useState(0)
    const [displaySavings, setDisplaySavings] = useState(0)

    const filteredTransactions = transaction.filter(t => {
        if (!startDate || !endDate) return true

        const tDate = new Date(t.date)
        return (
            tDate >= new Date(startDate) &&
            tDate <= new Date(endDate)
        )
    })

    const categoryData = Object.values(
        filteredTransactions
            .filter(t => t.type === "expense")
            .reduce((acc, curr) => {
                if (!acc[curr.category]) {
                    acc[curr.category] = {
                        name: curr.category,
                        value: 0
                    }
                }
                acc[curr.category].value += Number(curr.amount)
                return acc
            }, {})
    )

    const currentYear = new Date().getFullYear()

    const yearlyTransactions = transaction.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getFullYear() === currentYear
    })

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("default", { month: "short" }),
        expense: 0
    }))

    yearlyTransactions.forEach(t => {
        if (t.type === "expense") {
            const m = new Date(t.date).getMonth()
            monthlyData[m].expense += Number(t.amount)
        }
    })

    const COLORS = [
        "#ef4444", "#f97316", "#eab308", "#22c55e",
        "#3b82f6", "#6366f1", "#a855f7", "#ec4899"
    ]

    const income = filteredTransactions
        .filter(t => t.type === "income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0)

    const expense = filteredTransactions
        .filter(t => t.type === "expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0)

    const savings = income - expense

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
        animateValue(0, income, setDisplayIncome)
        animateValue(0, expense, setDisplayExpense)
        animateValue(0, savings, setDisplaySavings)
    }, [income, expense, savings])

    const formatCurrency = (num) => num.toLocaleString("en-IN")

    return (
        <div className='flex justify-center xl:mt-14 my-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>

            <div className='w-full max-w-7xl'>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                    <div className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-white shadow-md hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs sm:text-sm text-gray-500">Savings</h2>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <FaWallet />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-3 text-orange-600">
                            ₹{formatCurrency(displaySavings)}
                        </h1>

                    </div>

                    <div className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs sm:text-sm text-gray-500">Income</h2>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                                <FaArrowUp />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-3 text-green-600">
                            ₹{formatCurrency(displayIncome)}
                        </h1>

                    </div>

                    <div className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs sm:text-sm text-gray-500">Expense</h2>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                                <FaArrowDown />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-3 text-red-600">
                            ₹{formatCurrency(displayExpense)}
                        </h1>

                    </div>

                </div>

                <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow">
                        <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-center md:text-left">
                            Monthly Expenses
                        </h2>

                        <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[350px] min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="expense" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow">
                        <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-center md:text-left">
                            Category Breakdown
                        </h2>

                        <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[350px] min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="70%"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Graphics