import express from 'express'
import { submit, getCommentsList } from '../controller/commentController.js'
const commentsRouter = express.Router()

// Submit
commentsRouter.post('/', submit)

// getCommentsList
commentsRouter.get('/', getCommentsList)


export default commentsRouter