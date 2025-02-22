import express from 'express'
import { submit, getAttractionsList } from '../controller/attractionController.js'
const attractionsRouter = express.Router()

// Submit
attractionsRouter.post('/', submit)

// getAttractionsList
attractionsRouter.get('/page', getAttractionsList)


export default attractionsRouter