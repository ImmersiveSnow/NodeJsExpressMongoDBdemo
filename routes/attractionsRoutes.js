import express from 'express'
import { submit, getAttractionsList } from '../controller/attractionController.js'
import upload from '../middleware/uploadHandler.js'
const attractionsRouter = express.Router()

// Submit
attractionsRouter.post('/', upload.single('image'), submit)

// getAttractionsList
attractionsRouter.get('/page', getAttractionsList)


export default attractionsRouter