import express from 'express'
import { logoutUser, loginUser, registerUser, getMe } from '../controller/userController.js'
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get("/me", isAuthenticated, getMe)

export default router