import { ObjectId } from 'mongodb'
import asyncHandler from 'express-async-handler'
import Comments from '../model/commentsModel.js'


//@desc submit
//@route Post /comments
export const submit = asyncHandler(async (req, res, next) => {
  const { uid, content, exclusiveID } = req.body
  if(!uid || !content || !exclusiveID) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    await Comments.create({
      userId: uid, 
      exclusiveID,
      content
    })
    res.status(201).json({
      message: '评论发布成功'
    })
  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
  
})

//@desc getCommentsList
//@route Get /comments
export const getCommentsList = asyncHandler(async (req, res, next) => {
  console.log(req.query)
  const { exclusiveID } = req.query
  if(!exclusiveID) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    const totalComments = await Comments.countDocuments()
    const comments = await Comments.find({
      exclusiveID: exclusiveID
    })
    const data = comments.map(comment => ({
      uid: comment.userId,
      content: comment.content
    }))

    res.status(200).json({
      message: '获取评论成功',
      total: totalComments,
      data
    })

  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})