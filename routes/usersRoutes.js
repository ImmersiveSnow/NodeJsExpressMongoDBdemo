import express from 'express'
import { current, login, register } from '../controller/userController.js'
import { validateToken } from '../middleware/tokenHandler.js'
const usersRouter = express.Router()

// Get current users
usersRouter.get('/currentUser', validateToken, current)

// Login 
usersRouter.get('/login', login)

// Register
usersRouter.post('/register', register)


export default usersRouter