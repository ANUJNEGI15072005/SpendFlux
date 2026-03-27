import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_BASE_URL

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("User registered successfully", {
          autoClose: 1000,
          pauseOnHover: false,
          closeOnClick: true
        })
        setTimeout(() => {
          navigate('/login')
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
          Get Started
        </h1>
        <p className='text-center text-gray-500 mt-2 mb-6'>
          Register yourself
        </p>
        <form onSubmit={handleRegister} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Name
            </label>
            <input
              type="name"
              onChange={(e) => { setName(e.target.value) }}
              placeholder='Enter your name'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition'
            />
          </div>
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
              placeholder='Set password'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition'
            />
          </div>
          <button className='w-full bg-blue-900 text-white py-2 text-center font-semibold hover:bg-blue-800 transition'>
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-6">
          Already registered?
          <Link to={'/login'}>
            <span className="text-slate-900 font-medium cursor-pointer ml-1">
              Login
            </span>
          </Link>
        </p>
      </div>

    </div>
  )
}

export default Register
