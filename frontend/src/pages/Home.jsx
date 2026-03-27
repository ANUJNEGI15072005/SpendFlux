import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaWallet, FaArrowRight, FaChartPie, FaShieldAlt, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { MdOutlineSavings } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const faqs = [
    {
      question: "Is SpendFlux completely free to use?",
      answer: "Yes, SpendFlux is completely free to use. There are no hidden charges or subscriptions — you can start managing your finances without any cost."
    },
    {
      question: "How secure is my financial data?",
      answer: "Your data is protected using secure authentication and safe data handling practices. We prioritize your privacy and ensure your information remains confidential."
    },
    {
      question: "Can I track my daily expenses easily?",
      answer: "Absolutely. SpendFlux is designed to make expense tracking simple and quick, allowing you to log and monitor your daily spending effortlessly."
    },
    {
      question: "Does SpendFlux provide insights on my spending?",
      answer: "Yes, SpendFlux offers visual insights and analytics to help you understand your spending habits and make better financial decisions over time."
    }
  ];

  const features = [
    {
      title: "Track Expenses",
      description: "Easily record your daily spending and maintain a clear overview of your financial activity without any hassle or confusion.",
      icon: FaWallet
    },
    {
      title: "Set Budgets",
      description: "Create monthly budgets and keep your spending in check with smart tracking that helps you stay within your financial limits.",
      icon: MdOutlineSavings
    },
    {
      title: "View Insights",
      description: "Get detailed insights into your spending habits with visual charts that help you understand and improve your financial decisions.",
      icon: FaChartPie
    },
    {
      title: "Real-Time Data",
      description: "Stay updated instantly with real-time tracking of your expenses and balances as you manage your finances throughout the day.",
      icon: AiOutlineThunderbolt
    },
    {
      title: "Secure Data",
      description: "Your financial information is protected with secure authentication and reliable data handling to ensure complete privacy and safety.",
      icon: FaShieldAlt
    },
    {
      title: "AI Insights",
      description: "Get smart suggestions and insights powered by AI to optimize your spending habits and make better financial decisions effortlessly.",
      icon: RiRobot2Line
    }
  ];

  function handleStart() {
    navigate("/login")
  }

  return (
    <div className=''>

      <nav className="sticky top-0 z-50 flex sm:justify-between justify-center items-baseline sm:py-4 py-2 xl:px-20 lg:px-14 px-10 bg-white/70 backdrop-blur-md border-b border-gray-200 ">
        <Link to="/"><h1 className='text-3xl font-heading tracking-tight font-extrabold text-black inline-flex'>Spend<p className='text-blue-900'>Flux</p></h1></Link>
        {user && <button onClick={handleStart} className='sm:flex hidden items-center gap-2 font-semibold font-body text-lg rounded-lg text-white bg-blue-900 px-5 py-2 hover:bg-blue-800 transition'>Go to Dashboard<FaArrowRight /></button>}
        {!user && <button onClick={handleStart} className='sm:flex hidden items-center gap-2 font-semibold font-body text-lg rounded-lg text-white bg-blue-900 px-5 py-2 hover:bg-blue-800 transition'>Get Started<FaArrowRight /></button>}
      </nav>

      <div className='flex justify-between w-full xl:mt-14 mt-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>
        <div className='lg:w-1/2 w-full flex justify-center'>
          <div>
            <h1 className='xl:text-6xl lg:text-left sm:text-5xl text-4xl text-center font-heading font-bold leading-tight tracking-tight  text-gray-900'>
              Smarter Spending <br /> Starts With You
            </h1>
            <p className='xl:mt-6 mt-4 lg:text-left text-center font-body xl:text-xl sm:text-lg text-base text-gray-600 leading-tight max-w-xl'>
              From daily expenses to monthly budgets, SpendFlux gives you complete visibility and control over your money — all in one clean and powerful dashboard.
            </p>
            <p className='mt-4 lg:text-left text-center font-body xl:text-xl sm:text-lg text-base text-gray-600 leading-tight max-w-xl'>
              Whether you're saving, budgeting, or just trying to spend better, SpendFlux keeps everything simple and under control.
            </p>
            <div className='flex lg:justify-start justify-center'>
              <button onClick={handleStart} className='xl:mt-10 mt-6 flex items-center gap-2 font-semibold font-body xl:text-xl text-lg rounded-lg text-white bg-blue-900 xl:px-5 xl:py-3 px-3 py-2  hover:bg-blue-800 transition'>Start your Journey<FaArrowRight /></button>
            </div>
          </div>
        </div>
        <div className='lg:w-1/2 lg:flex hidden items-center'>
          <img className='' src="/SpendFlux.png" alt="" />
        </div>
      </div>

      <div className='w-full mt-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>
        <h1 className='text-center font-heading font-bold tracking-tight text-4xl'>
          Why SpendFlux?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-8 ">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105">
                <div className="flex justify-start items-baseline">
                  <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full">
                    <Icon className="text-blue-900 text-2xl" />
                  </div>
                  <h3 className="lg:text-2xl text-xl ml-4 font-heading font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 lg:text-xl text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex justify-center mt-8 py-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>
        <div>
          <h2 className="text-4xl text-center font-heading font-bold text-gray-900">
            It’s Free. Start Now.
          </h2>
          <p className="mt-2 text-xl text-gray-600 text-center max-w-5xl ">
            Create your account in seconds and begin tracking your finances effortlessly, with a clean and powerful system designed to keep everything organized — completely free to use.
          </p>
          <div className="flex justify-center mt-10">
            {user && <button onClick={handleStart} className='flex items-center gap-2 font-semibold font-body text-xl rounded-lg text-white bg-blue-900 px-5 py-3 hover:bg-blue-800 transition'>Go to Dashboard<FaArrowRight /></button>}
            {!user && <button onClick={handleStart} className='flex items-center gap-2 font-semibold font-body text-xl rounded-lg text-white bg-blue-900 px-5 py-3 hover:bg-blue-800 transition'>Get Started for free<FaArrowRight /></button>}
          </div>
        </div>
      </div>

      <div className='flex justify-between w-full xl:mt-14 mt-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32'>
        <div>
          <h1 className='text-center text-4xl font-heading font-bold'>Frequently Asked Questions</h1>
          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
            {faqs.map((faq, index) => {
              return (
                <div key={index} className='group py-6 px-10 rounded-xl border border-gray-300 hover:shadow-lg transition'>
                  <h3 className='lg:text-2xl text-xl text-gray-900 group-hover:text-blue-900 font-body font-semibold'>{faq.question}</h3>
                  <h3 className='lg:text-xl text-lg mt-2 leading-tight text-gray-600 font-body'>{faq.answer}</h3>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className='flex justify-center mt-16 mb-10 px-6'>
        <div className='text-center'>
          <h1 className='text-4xl font-heading font-bold text-gray-900 mb-10'>
            Meet the Developer
          </h1>
          <div className="flex justify-center">
            <div className='bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transform transition p-8 w-[320px]'>
              <div className='flex justify-center'>
                <div className='w-24 h-24 rounded-full bg-blue-900 text-white flex items-center justify-center text-6xl font-bold'>
                  A
                </div>
              </div>
              <h3 className='mt-4 text-xl font-heading font-bold text-gray-900'>
                Anuj Negi
              </h3>
              <p className='text-blue-900 font-medium'>
                MERN Stack & ML Developer
              </p>
              <p className='mt-3 text-gray-600 text-sm leading-relaxed'>
                Expert in MongoDB, Express.js, React, and Node.js development. Focuses on building scalable full-stack applications and integrating machine learning solutions to create smart, data-driven user experiences.
              </p>
              <div className='mt-5 flex justify-center gap-4 text-xl'>
                <a href="mailto:anujn158@email.com" className='text-gray-600 hover:text-blue-900 transition'>
                  <FaEnvelope />
                </a>
                <a href="https://www.linkedin.com/in/anujnegi-webdev" target="_blank" className='text-gray-600 hover:text-blue-900 transition'>
                  <FaLinkedin />
                </a>
                <a href="https://github.com/ANUJNEGI15072005" target="_blank" className='text-gray-600 hover:text-blue-900 transition'>
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Home
