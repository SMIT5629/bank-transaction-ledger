const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists!"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email!"],
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, "Name is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: [6, "Password must be at least 6 characters!"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return 
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return 
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('user', userSchema)