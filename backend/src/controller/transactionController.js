import { Transaction } from "../model/transaction.js"

export const incomeAdder = async (req, res, next) => {
    try {
        const { amount, category, description, date } = req.body
        if (!amount || !category) {
            const error = new Error("Amount and Category are required")
            error.statusCode = 400
            return next(error)
        }
        const transaction = await Transaction.create({
            user: req.user.id,
            type: "income",
            amount,
            category,
            description,
            date:date || Date.now()
        })
        res.status(201).json({
            success: true,
            message: "Income added successfully",
            transaction
        })
    } catch (err) {
        next(err)
    }
}

export const expenseAdder = async (req, res, next) => {
    try {
        const { amount, category, description, date } = req.body
        if (!amount || !category) {
            const error = new Error("Amount and Category are required")
            error.statusCode = 400
            next(error)
            return;
        }
        const transaction = await Transaction.create({
            user: req.user.id,
            type: "expense",
            amount,
            category,
            description, 
            date: date || Date.now()
        })
        res.json({
            success: true,
            message: "Expense added successfully",
            transaction
        })
    } catch (error) {
        next(error)
    }
}

export const getTransactions = async (req, res, next) => {
    try {
        const user = req.user.id
        const transaction = await Transaction.find({ user }).sort({ date: -1 })
        res.json({
            success: true,
            count: transaction.length,
            transaction
        })
    } catch (error) {
        next(error)
    }
}

export const transactionRemove = async (req, res, next) => {
    try {
        const { id } = req.params
        const transaction = await Transaction.findById(id)
        if (!transaction) {
            const error = new Error("Transaction not found")
            error.statusCode = 404
            return next(error)
        }
        if (transaction.user.toString() != req.user.id) {
            const error = new Error("Not authorized to delete this transaction");
            error.statusCode = 403;
            return next(error);
        }
        await transaction.deleteOne()
        res.json({
            success: true,
            message: "Transaction deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const transactionUpdate = async (req, res, next) => {
    try {
        const { id } = req.params
        const { amount, category, description } = req.body
        const transaction = await Transaction.findById(id)
        if(!transaction){
            const error = new Error("Transaction not found")
            error.statusCode = 404
            return next(error)
        }
        if(transaction.user.toString()!=req.user.id){
            const error = new Error("Not authorized to update this transaction")
            error.statusCode = 403
            return next(error)
        }
        if(amount!=undefined) transaction.amount = amount
        if(category!=undefined) transaction.category = category
        if(description!=undefined) transaction.description = description
        const updatedTransaction = await transaction.save()
        res.json({
            success: true,
            message:"Transaction updated successfully",
            transaction : updatedTransaction
        })
    } catch (error) {
        next(error)
    }
}