const express = require('express');
const router = express.Router();
const TransactionController = require("../controllers/transaction.controller")
const AuthMiddleware = require("../middleware/auth.middleware")


router.post("/", AuthMiddleware.authUser, TransactionController.createTransaction)

router.post("/system/initial-fund",AuthMiddleware.authSystemUserMiddleware, TransactionController.createIntitilFundTransaction)

router.get("/history/:accountId", AuthMiddleware.authUser, TransactionController.transActionHistory)

module.exports = router;