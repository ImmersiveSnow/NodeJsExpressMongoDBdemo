import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const validateToken = asyncHandler(async (req, res, next) => {
  const autHeader = req.headers.authorization || req.headers.Authorization

  if (autHeader && autHeader.startsWith('Bearer ')) {
    const token = autHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error('token未校验通过')
        error.status = 401
        return next(error)
      }
      req.userData = decoded.userData
      next()
    })
  } else {
    const error = new Error('token出错')
    error.status = 401
    return next(error)
  }
})