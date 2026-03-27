import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRouter.js'
import transactionRouter from './routes/transactionRouter.js'
import budgetRouter from './routes/budgetRouter.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({
    origin: "https://spendflux-tracker.vercel.app", 
    credentials: true
}))
app.use(cookieParser())
const PORT = process.env.PORT || 8080

try {
    connectDB()
    console.log("Mongo DB connected")
} catch (error) {
    console.error(error)
    process.exit(1)
}

app.use('/user', userRouter)
app.use('/transaction', transactionRouter)
app.use('/budget', budgetRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    res.status(statusCode).json({ message })
})

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
})