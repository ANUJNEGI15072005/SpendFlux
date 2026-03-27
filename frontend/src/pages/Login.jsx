import React from 'react'
import { useState, useContext,  } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_BASE_URL

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Server error")
      console.error(error)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-900 '>
      <div className='bg-white w-full sm:max-w-md xs:max-w-[340px] max-w-[300px] rounded-2xl shadow-2xl p-3 xs:p-5 sm:p-8'>
        <h1 className='text-3xl font-bold text-center text-blue-900'>
          Welcome Back
        </h1>
        <p className='text-center text-gray-500 mt-2 mb-6'>
          Login in to your account
        </p>
        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Email
            </label>
            <input
              type="email"
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder='Enter your email'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Password
            </label>
            <input
              type="password"
              onChange={(e) => { setPassword(e.target.value) }}
              placeholder='Enter your password'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition'
            />
          </div>
          <button className='w-full bg-blue-900 text-white py-2 text-center font-semibold hover:bg-blue-800 transition'>
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?
          <Link to={'/register'}>
            <span className="text-slate-900 font-medium cursor-pointer ml-1">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
