const express = require('express');
const router = express.Router();
const AccountController = require("../controllers/account.controller")
const AuthMiddleware = require("../middleware/auth.middleware")

router.post("/",AuthMiddleware.authUser,AccountController.createAccount )

router.get("/", AuthMiddleware.authUser, AccountController.getUserAccounts)

router.get("/balance/:accountId", AuthMiddleware.authUser, AccountController.getAccountBalance)

module.exports = router;