const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */


async function createTransaction(req, res) {

    /**
    *1. Validate request body
    */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Missing required fields"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })
    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "Account not found"
        })
    }


    /** 
    * 2. Validate idempotency key
    */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey
    })

    if (isTransactionAlreadyExists) {

        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already completed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is pending",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction failed",
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }


    /** 
    * 3. Check account status
    */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "One or both accounts are not active"
        })
    }


    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}.Required balance is ${amount}`
        })
    }


    /**
     * 5. Create transaction (PENDING)
     */
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }], { session })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        type: "DEBIT",
        amount,
        transaction: transaction[0]._id
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        type: "CREDIT",
        amount,
        transaction: transaction[0]._id
    }], { session })

    transaction[0].status = "COMPLETED"
    await transaction[0].save({ session })

    await session.commitTransaction()
    session.endSession()

    /**
     * 10. Send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    return res.status(200).json({
        message: "Transaction successful",
        transaction: transaction
    })
}

async function createIntitilFundTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Missing required fields"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })

    if (!fromUserAccount) {
        return res.status(404).json({
            message: "System account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        type: "DEBIT",
        amount,
        transaction: transaction._id
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        type: "CREDIT",
        amount,
        transaction: transaction._id
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()


    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })

}

async function transActionHistory(req, res) {
    try {
        const { accountId } = req.params
        const { page = 1, limit = 10 } = req.query

        if (!accountId) {
            return res.status(400).json({ message: "Account ID is required" })
        }

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if (!account) {
            return res.status(403).json({
                 message: "You are not authorized to view transactions for this account" 
                })
        }

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: accountId },
                { toAccount: accountId }
            ]
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))

        return res.status(200).json({
            message: "Transaction history retrieved successfully",
            page: Number(page),
            limit: Number(limit),
            total: transactions.length,
            transactions
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { createTransaction, createIntitilFundTransaction, transActionHistory }