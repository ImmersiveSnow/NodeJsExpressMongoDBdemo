import express from 'express'
import { submit, getToursList } from '../controller/tourController.js'
const toursRouter = express.Router()

// Submit
toursRouter.post('/', submit)

// getToursList
toursRouter.get('/page', getToursList)


export default toursRouter