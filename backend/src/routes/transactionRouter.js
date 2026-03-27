import express from 'express'
import { expenseAdder, getTransactions, incomeAdder, transactionRemove, transactionUpdate } from '../controller/transactionController.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post("/income", isAuthenticated, incomeAdder)
router.post("/expense", isAuthenticated, expenseAdder)
router.get("/", isAuthenticated, getTransactions)
router.delete("/remove/:id", isAuthenticated, transactionRemove )
router.patch("/:id", isAuthenticated, transactionUpdate)

export default router