import express from 'express'
import { getOrdersList, orderTour, delOrder } from '../controller/orderController.js'
const ordersRouter = express.Router()

// getOrdersList
ordersRouter.get('/page', getOrdersList)

// orderTour
ordersRouter.post('/', orderTour)

// delOrder
ordersRouter.delete('/', delOrder)

export default ordersRouter