import bcrypt from 'bcryptjs'
import { User } from '../model/user.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        const error = new Error("All fields are required")
        error.statusCode = 400
        next(error)
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/
    if (!passwordRegex.test(password)) {
        const error = new Error("Password must be 8-12 chars, include uppercase, lowercase, number & symbol")
        error.statusCode = 400
        next(error)
        return;
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        const error = new Error("User already exists")
        error.statusCode = 409
        next(error)
        return;
    }
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        await User.create({
            name, email, password: hash
        })
        res.json({ message: "User registered successfully" })
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const error = new Error("All fields are required")
        error.statusCode = 400
        next(error)
        return;
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            next(error)
            return;
        }
        const matched = bcrypt.compareSync(password, user.password)
        if (!matched) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            next(error)
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        })
        res.json({ message: "Login successful", user: { _id: user._id, email: user.email, name: user.name } })
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            expires: new Date(0)
        });

        res.json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            return next(error)
        }

        res.status(200).json(user)

    } catch (err) {
        next(err)
    }
}