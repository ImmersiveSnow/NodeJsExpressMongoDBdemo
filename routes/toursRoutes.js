import express from 'express'
import { submit, getToursList } from '../controller/tourController.js'
import upload from '../middleware/uploadHandler.js'
const toursRouter = express.Router()

// Submit
toursRouter.post('/', upload.single('image'), submit)

// getToursList
toursRouter.get('/page', getToursList)


export default toursRouter