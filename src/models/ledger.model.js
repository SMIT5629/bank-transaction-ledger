const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Ledger entry must have an account!"],
        index: true,
        immutable: true//mean once a ledger entry is created, the account cannot be changed to maintain data integrity
    },
    amount:{
        type: Number,
        required: [true, "Ledger entry must have an amount!"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger entry must be associated with a transaction!"],
        index: true,
        immutable: true
    },
    type:{
        type: String,
        enum: {
            values: ["DEBIT", "CREDIT"],
            message: "Ledger entry type must be either DEBIT or CREDIT!"
    },
    required: [true, "Ledger entry must have a type!"],
    immutable: true
    }
}, { timestamps: true })

function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

//Add pre hooks to prevent any updates or deletions of ledger entries after they are created
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

module.exports = mongoose.model("ledger", ledgerSchema)
