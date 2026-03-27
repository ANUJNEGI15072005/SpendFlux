import express from 'express'
import { isAuthenticated } from '../middleware/auth.js'
import { budgetHandler, getBudget, updateBudget } from '../controller/budgetController.js'
import { getInsights } from '../controller/groqController.js'

const router = express.Router()

router.post('/', isAuthenticated, budgetHandler)
router.get('/', isAuthenticated, getBudget)
router.patch('/:id', isAuthenticated, updateBudget)
router.post("/insights", getInsights)

export default router