const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.contoller")
const AuthMiddleware = require("../middleware/auth.middleware")

router.post("/register", AuthController.userRegister)
router.post("/login", AuthController.userLogin)
router.post("/logout", AuthController.userLogout)
router.get("/get-me", AuthMiddleware.authUser, AuthController.getMe)

module.exports = router;