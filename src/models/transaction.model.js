const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.String,
        ref: "account",
        required: [true, "Transaction must have a from account!"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.String,
        ref: "account",
        required: [true, "Transaction must have a from account!"],
        index: true
    },
    status:{
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED","REVERSED"],
            message: "Status must be either PENDING, COMPLETED, FAILED or REVERSED!",

        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Transaction must have an amount!"],
        min: [0, "Amount must be greater than or equal to 0!"]
    },
    //prevent duplicate transactions in case of network issues or client retries
    idempotencyKey: {
        type: String,
        required: [true, "Transaction must have an idempotency key!"],
        unique: true,
        index: true
    }
}, { timestamps: true })    

module.exports = mongoose.model("transaction", transactionSchema)
