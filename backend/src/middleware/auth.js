import jwt from "jsonwebtoken"

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token

    // if (!token) {
    //   const error = new Error("Not authenticated")
    //   error.statusCode = 401
    //   return next(error)
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // attach user info to request
    req.user = { id: decoded.id }

    next()
  } catch (err) {
    const error = new Error("Invalid token")
    error.statusCode = 401
    next(error)
  }
}