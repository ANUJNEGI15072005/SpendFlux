import { Budget } from "../model/budget.js"

export const budgetHandler = async (req, res, next) => {
    try {
        const { amount } = req.body
        if (!amount) {
            const error = new Error("Amount is required")
            error.statusCode = 400
            return next(error)
        }
        const now = new Date()
        const budget = await Budget.create({
            user: req.user.id,
            amount,
            month: now.getMonth(),
            year: now.getFullYear(),
        })
        res.status(201).json({
            success: true,
            message: "Budget set successfully",
            budget
        })
    } catch (error) {
        next(error)
    }
}

export const getBudget = async (req, res, next) => {
    try {
        const user = req.user.id
        const now = new Date()

        const budget = await Budget.findOne({
            user,
            month: now.getMonth(),
            year: now.getFullYear(),
        })
        res.json({
            success: true,
            budget,
        })
    } catch (error) {
        next(error)
    }
}

export const updateBudget = async (req, res, next) => {
    try {
        const { id } = req.params
        const { amount } = req.body
        const budget = await Budget.findById(id)
        if (!budget) {
            const error = new Error("Budget not found")
            error.statusCode = 404
            return next(error)
        }
        if (budget.user.toString() != req.user.id) {
            const error = new Error("Not authorized to update this budget")
            error.statusCode = 403
            return next(error)
        }
        if (amount != undefined) budget.amount = amount
        const updatedBudget = await budget.save()
        res.json({
            success: true,
            message: "Budget updated successfully",
            transaction: updatedBudget
        })
    } catch (error) {
        next(error)
    }
}