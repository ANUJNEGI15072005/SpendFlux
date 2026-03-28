import jwt from "jsonwebtoken"

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch (err) {
    const error = new Error("Invalid token")
    error.statusCode = 401
    next(error)
  }
}