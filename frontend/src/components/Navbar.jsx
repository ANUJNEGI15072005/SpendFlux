import { NavLink, Link } from "react-router-dom"
import { useState } from "react"
import { FaBars } from "react-icons/fa"
import { MdClose } from "react-icons/md"

const Navbar = () => {
    const [open, setOpen] = useState(false)

    const linkClass = ({ isActive }) =>
        `block px-3 py-2 text-base transition-all duration-300 rounded-md
        ${isActive
            ? "text-blue-900 bg-blue-50 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`

    return (
        <>
            <div className='sticky top-0 z-50 flex justify-between items-center sm:py-4 py-3 xl:px-20 lg:px-14 px-4 sm:px-6 bg-white/70 backdrop-blur-md border-b border-gray-200'>

                <Link to="/dashboard">
                    <h1 className='text-2xl sm:text-3xl font-heading font-extrabold tracking-tight'>
                        Spend<span className='text-blue-900'>Flux</span>
                    </h1>
                </Link>

                <ul className='hidden sm:flex items-center lg:gap-x-10 gap-4 font-body'>
                    <li><NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink></li>
                    <li><NavLink to="/transactions" className={linkClass}>Transactions</NavLink></li>
                    <li><NavLink to="/budget" className={linkClass}>Budget</NavLink></li>
                    <li><NavLink to="/profile" className={linkClass}>Profile</NavLink></li>
                </ul>

                <button
                    onClick={() => setOpen(true)}
                    className="sm:hidden text-xl text-gray-700"
                >
                    <FaBars />
                </button>
            </div>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                />
            )}

            <div className={`fixed top-0 left-0 h-full w-[260px] bg-white z-50 shadow-xl transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}`}>

                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <h1 className='text-xl font-heading font-bold'>
                        Spend<span className='text-blue-900'>Flux</span>
                    </h1>
                    <button onClick={() => setOpen(false)} className="text-xl">
                        <MdClose />
                    </button>
                </div>

                <ul className="flex flex-col gap-2 p-4 font-body">
                    <li>
                        <NavLink onClick={() => setOpen(false)} to="/dashboard" className={linkClass}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => setOpen(false)} to="/transactions" className={linkClass}>
                            Transactions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => setOpen(false)} to="/budget" className={linkClass}>
                            Budget
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={() => setOpen(false)} to="/profile" className={linkClass}>
                            Profile
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Navbar