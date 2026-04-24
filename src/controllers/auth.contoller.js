const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlacklistModel = require("../models/backList.model")

const userRegister = async (req, res) => {

    const { email, name, password } = req.body;

    const ifExists = await userModel.findOne({
        email: email
    })
    if (ifExists) {
        return res.status(400).json({
            status: "failed",
            message: "User already exists"
        })
    }

    const user = await userModel.create({
        email, name, password
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email,user.name)

}

const userLogin = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}

const userLogout = async (req, res) => {
    const token = req.cookies.token
    if (token) {
        await tokenBlacklistModel.create({ token })
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
    res.status(400).json({
        message: "No token found"
    })
}

const getMe = async (req, res) => {
    const user = await userModel.findById(req.user._id)
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })
}


module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getMe
}