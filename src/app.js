const express = require("express")
const connectDB = require("./config/connectDB")
const morgan= require("morgan")
const cookieParser = require("cookie-parser")

const authRouter = require("./routes/auth.route")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/trasaction.routes")


const app = express();

connectDB()
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())



app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app;
