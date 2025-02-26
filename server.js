import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import connectdb from './config/db.js'
import usersRoutes from './routes/usersRoutes.js'
import toursRoutes from './routes/toursRoutes.js'
import attractionsRouter from './routes/attractionsRoutes.js'
import ordersRouter from './routes/ordersRoutes.js'
import commentsRouter from './routes/commentsRouter.js'
import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import cors from 'cors'
const port = process.env.PORT || 3001
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//cors
app.use(cors())
// multer

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logger middleware
app.use(logger)

// setup static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/users', usersRoutes)
app.use('/tours', toursRoutes)
app.use('/attractions', attractionsRouter)
app.use('/orders', ordersRouter)
app.use('/comments', commentsRouter)
connectdb()

// Error handler
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is starting on http://localhost:${port}`)
})
